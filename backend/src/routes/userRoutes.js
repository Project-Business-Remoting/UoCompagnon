const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// Route de test pour vérifier si le token fonctionne
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
