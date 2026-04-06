const notificationService = require("../services/notificationService");
const { getIO } = require("../config/socket");

const getNotifications = async (req, res) => {
  try {
    const { step } = req.query;
    const notifications = await notificationService.getNotificationsByStep(
      step,
      req.user,
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Notifications intelligentes — combinaison dynamiques + persistantes
const getSmartNotifications = async (req, res) => {
  try {
    const notifications =
      await notificationService.getSmartNotificationsForUser(req.user);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const user = await notificationService.markAllAsRead(req.user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markOneAsRead = async (req, res) => {
  try {
    const user = await notificationService.markOneAsRead(
      req.user,
      req.params.id,
    );
    res.json(user);
  } catch (error) {
    if (error.message === "Notification non autorisee") {
      return res.status(403).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const deleted = await notificationService.deleteOneNotification(
      req.params.id,
      req.user,
    );
    if (!deleted) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }
    res.json({ message: "Notification supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const createNotification = async (req, res) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    
    // Notifications emitted to all users
    try {
      const io = getIO();
      io.emit("new-notification", notification);
    } catch (socketErr) {
      console.error("[Socket.IO] Failed to emit admin notification:", socketErr.message);
    }
    
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  getSmartNotifications,
  markAsRead,
  markOneAsRead,
  deleteNotification,
  createNotification,
};
