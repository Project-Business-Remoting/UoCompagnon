const Notification = require("../models/Notification");
const User = require("../models/User");
const { getUserPhase, generateSmartNotifications } = require("./phaseService");

const getNotificationsByStep = async (step) => {
  return await Notification.find({ relatedStep: step });
};

/**
 * Récupère les notifications intelligentes pour un utilisateur :
 * - Notifications dynamiques générées à la volée (basées sur le timing)
 * - Notifications persistantes de la base filtrées par phase
 * - Fusionnées et triées par pertinence
 */
const getSmartNotificationsForUser = async (user) => {
  const currentStep = getUserPhase(user);

  // 1. Notifications dynamiques (générées à la volée)
  const smartNotifs = generateSmartNotifications(user);

  // 2. Notifications persistantes de la base (filtrées par phase OU par utilisateur spécifique)
  const dbNotifs = await Notification.find({
    $or: [
      { relatedStep: currentStep, user: null },
      { user: user._id }
    ]
  });

  // 3. Marquer les notifications déjà lues
  const readIds = user.readNotifications.map((id) => id.toString());
  const dbNotifsWithStatus = dbNotifs.map((n) => ({
    ...n.toObject(),
    isRead: readIds.includes(n._id.toString()),
    isSmartNotification: false,
  }));

  // 4. Combiner : notifications smart en premier (toujours non lues), puis DB
  return [...smartNotifs, ...dbNotifsWithStatus];
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

const markOneAsRead = async (userId, notificationId) => {
  return await User.findByIdAndUpdate(
    userId,
    { $addToSet: { readNotifications: notificationId } },
    { new: true },
  );
};

const deleteOneNotification = async (notificationId) => {
  return await Notification.findByIdAndDelete(notificationId);
};

module.exports = { 
  getNotificationsByStep, 
  getSmartNotificationsForUser,
  markAllAsRead,
  markOneAsRead,
  deleteOneNotification
};
