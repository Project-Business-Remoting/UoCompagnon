const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getSmartNotifications,
  markAsRead,
  markOneAsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getNotifications); // Route existante (filtrage par ?step=)
router.get("/smart", protect, getSmartNotifications); // Notifications intelligentes
router.put("/mark-read", protect, markAsRead); // Marquer toutes comme lues
router.put("/mark-read/:id", protect, markOneAsRead); // Marquer une comme lue

module.exports = router;
