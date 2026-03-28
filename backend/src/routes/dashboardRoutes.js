const express = require("express");
const router = express.Router();
const {
  getStudentDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

// Dashboard étudiant (protégé par JWT)
router.get("/", protect, getStudentDashboard);

// Dashboard admin (protégé par JWT + vérification rôle admin)
router.get("/admin", protect, adminProtect, getAdminDashboard);

module.exports = router;
