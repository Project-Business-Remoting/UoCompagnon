const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getSmartNotifications,
  markAsRead,
  markOneAsRead,
  deleteNotification,
  createNotification,
} = require("../controllers/notificationController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

router.get("/", protect, getNotifications); // Route existante (filtrage par ?step=)
router.get("/smart", protect, getSmartNotifications); // Notifications intelligentes
router.put("/mark-read", protect, markAsRead); // Marquer toutes comme lues
router.put("/mark-read/:id", protect, markOneAsRead); // Marquer une comme lue
router.delete("/:id", protect, deleteNotification); // Supprimer la notification
router.post("/", protect, adminProtect, createNotification); // Admin seulement: Créer une notification

module.exports = router;
