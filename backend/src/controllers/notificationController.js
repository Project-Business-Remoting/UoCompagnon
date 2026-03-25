const notificationService = require("../services/notificationService");

const getNotifications = async (req, res) => {
  try {
    const { step } = req.query; // ex: ?step=Avant l'arrivée
    const notifications =
      await notificationService.getNotificationsByStep(step);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    // req.user sera injecté par notre futur middleware d'authentification
    const user = await notificationService.markAllAsRead(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
