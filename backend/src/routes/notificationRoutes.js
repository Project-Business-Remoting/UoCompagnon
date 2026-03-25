const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getNotifications);
router.put("/mark-read", protect, markAsRead); // Route protégée

module.exports = router;
