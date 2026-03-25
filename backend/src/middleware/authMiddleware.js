const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // On vérifie si le token est présent dans les headers (format: Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Décodage du token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // On récupère l'utilisateur depuis la DB et on l'injecte dans req.user (sans le mot de passe)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // On passe au contrôleur suivant
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Non autorisé, token invalide" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Non autorisé, pas de jeton" });
  }
};

module.exports = { protect };
