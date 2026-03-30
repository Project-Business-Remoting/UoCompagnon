const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

const { calculateCurrentStep } = require("../config/constants");

// Route de test pour vérifier si le token fonctionne
router.get("/profile", protect, (req, res) => {
  const userObj = req.user.toObject();
  userObj.currentStep = calculateCurrentStep(req.user.arrivalDate, req.user.classStartDate);
  res.json(userObj);
});

module.exports = router;
