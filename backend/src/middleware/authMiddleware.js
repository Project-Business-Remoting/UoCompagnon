const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token = req.cookies.uo_token;

  // Optionnel: fallback au header Authorization si pas de cookie
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Non autorise, utilisateur introuvable" });
      }

      next();
    } catch (error) {
      // On ne loggue pas l'erreur complète pour ne pas spammer la console avec "invalid signature"
      // lors des conflits de cookies entre étudiant/admin sur localhost.
      return res.status(401).json({ message: "Non autorisé, token invalide" });
    }
  } else {
    return res.status(401).json({ message: "Non autorisé, pas de jeton" });
  }
};

// Middleware pour vérifier le rôle admin
const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Accès refusé, rôle administrateur requis" });
  }
};

module.exports = { protect, adminProtect };
