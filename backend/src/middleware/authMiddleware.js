const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
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
