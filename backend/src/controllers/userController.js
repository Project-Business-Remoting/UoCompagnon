const userService = require("../services/userService");
const { put } = require("@vercel/blob");
const multer = require("multer");
const User = require("../models/User");
const { getIO } = require("../config/socket");
const notificationService = require("../services/notificationService");

const COOKIE_MAX_AGE_MS =
  Number(process.env.COOKIE_MAX_AGE_MS) || 7 * 24 * 60 * 60 * 1000;

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: COOKIE_MAX_AGE_MS,
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.token;
  delete user.token; // Ne pas envoyer le token en clair dans le JSON

  res
    .status(statusCode)
    .cookie("uo_token", token, getCookieOptions())
    .json(user);
};

const register = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie("uo_token", {
    ...getCookieOptions(),
    maxAge: 0,
  });
  res.status(200).json({ message: "Déconnexion réussie" });
};

const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserProfile(
      req.user._id,
      req.body,
    );
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const students = await userService.getAllStudents();
    res.json(students);
  } catch (error) {
    next(error);
  }
};

// Configuration Multer pour stockage en mémoire
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }

    // Upload direct du buffer vers Vercel Blob
    const blob = await put(req.file.originalname, req.file.buffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: req.file.mimetype,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        profilePicture: blob.url,
        profilePictureStatus: "pending"
      },
      { returnDocument: "after" },
    ).select("-password");

    // Émettre l'événement pour que l'admin le voit instantanément
    try {
      const io = getIO();
      if (io) {
        io.emit("photo-status-updated", {
          userId: req.user._id,
          status: "pending",
          profilePicture: blob.url
        });
      }
    } catch (socketErr) {
      console.error("[Socket.IO] Failed to emit photo status update on upload:", socketErr.message);
    }

    res.status(200).json({
      message: "Photo mise à jour avec succès",
      profilePicture: blob.url,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const updatePhotoStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["pending", "verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePictureStatus: status },
      { returnDocument: 'after' }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const title = {
      fr: status === "verified" ? "Photo de profil validée" : "Photo de profil refusée",
      en: status === "verified" ? "Profile picture verified" : "Profile picture rejected"
    };
    const message = {
      fr: status === "verified" 
        ? "Votre photo de profil a été validée par un administrateur." 
        : "Votre photo de profil a été refusée. Veuillez en soumettre une nouvelle.",
      en: status === "verified"
        ? "Your profile picture has been verified by an administrator."
        : "Your profile picture has been rejected. Please submit a new one."
    };

    // Créer une notification persistante en base de données
    try {
      await notificationService.createNotification({
        user: id, 
        title,
        message,
        type: status === "verified" ? "success" : "warning",
        relatedStep: "All Students",
        isSystem: true
      });
    } catch (notifErr) {
      console.error("[Backend Notification Error]:", notifErr.message);
    }

    // Émettre un événement Socket pour notifier l'étudiant en temps réel
    try {
      const io = getIO();
      if (io) {
        io.emit("photo-status-updated", {
          userId: id,
          status: status,
          title: title,
          message: message
        });
      }
    } catch (socketErr) {
      console.error("[Socket.IO] Failed to emit photo status update:", socketErr.message);
    }

    res.status(200).json({
      message: `Statut de la photo mis à jour : ${status}`,
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  updateProfile,
  getAllStudents,
  uploadProfilePicture,
  updatePhotoStatus,
  uploadMiddleware: upload.single("profilePicture"),
};
