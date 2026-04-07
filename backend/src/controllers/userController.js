const userService = require("../services/userService");

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

const register = async (req, res) => {
  try {
    // req.body contiendra nom, email, password, programme, arrivalDate, classStartDate
    const user = await userService.registerUser(req.body);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("uo_token", {
    ...getCookieOptions(),
    maxAge: 0,
  });
  res.status(200).json({ message: "Déconnexion réussie" });
};

const updateProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserProfile(
      req.user._id,
      req.body,
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await userService.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const { put } = require("@vercel/blob");
const multer = require("multer");
const User = require("../models/User");

// Configuration Multer pour stockage en mémoire
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const { getIO } = require("../config/socket");

const uploadProfilePicture = async (req, res) => {
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
    // On réinitialise le statut à 'pending' lors d'un nouvel upload
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        profilePicture: blob.url,
        profilePictureStatus: "pending"
      },
      { new: true },
    ).select("-password");

    res.status(200).json({
      message: "Photo mise à jour avec succès",
      profilePicture: blob.url,
      user: updatedUser,
    });
  } catch (error) {
    console.error("[Backend Upload Error]:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'upload: " + error.message });
  }
};

const updatePhotoStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["pending", "verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePictureStatus: status },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Émettre un événement Socket pour notifier l'étudiant
    try {
      const io = getIO();
      // On envoie un événement spécifique à l'utilisateur (userId)
      // On utilise une room 'user_:id' si existante, ou un broadcast filtré côté client
      // Ici, on broadcast et le client filtrera par son ID, ou on peut utiliser les rooms socket.io
      io.emit("photo-status-updated", {
        userId: id,
        status: status,
        message: status === "verified" 
          ? "Votre photo de profil a été validée !" 
          : "Votre photo de profil a été refusée. Veuillez en soumettre une nouvelle."
      });
    } catch (socketErr) {
      console.error("[Socket.IO] Failed to emit photo status update:", socketErr.message);
    }

    res.status(200).json({
      message: `Statut de la photo mis à jour : ${status}`,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut: " + error.message });
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
