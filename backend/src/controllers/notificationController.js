const notificationService = require("../services/notificationService");

const getNotifications = async (req, res) => {
  try {
    const { step } = req.query;
    const notifications =
      await notificationService.getNotificationsByStep(step);
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
    const user = await notificationService.markAllAsRead(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markOneAsRead = async (req, res) => {
  try {
    const user = await notificationService.markOneAsRead(
      req.user._id,
      req.params.id
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const deleted = await notificationService.deleteOneNotification(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }
    res.json({ message: "Notification supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  getSmartNotifications,
  markAsRead,
  markOneAsRead,
  deleteNotification,
};
