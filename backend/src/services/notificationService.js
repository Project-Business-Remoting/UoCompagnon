const Notification = require("../models/Notification");
const User = require("../models/User");

const getNotificationsByStep = async (step) => {
  return await Notification.find({ relatedStep: step });
};

const markAllAsRead = async (userId) => {
  const notifications = await Notification.find();
  const allIds = notifications.map((n) => n._id);
  return await User.findByIdAndUpdate(
    userId,
    { $addToSet: { readNotifications: { $each: allIds } } },
    { new: true },
  );
};

module.exports = { getNotificationsByStep, markAllAsRead };
