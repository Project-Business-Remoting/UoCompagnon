const Notification = require("../models/Notification");
const User = require("../models/User");
const { getUserPhase, generateSmartNotifications } = require("./phaseService");

const getNotificationsByStep = async (step, user) => {
  if (user.role === "admin") {
    const filter = step ? { relatedStep: step } : {};
    return await Notification.find(filter);
  }

  const currentStep = getUserPhase(user);
  return await Notification.find({
    $or: [
      { relatedStep: currentStep, user: null },
      { relatedStep: "All Students", user: null },
      { user: user._id },
    ],
  });
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

  // 2. Notifications persistantes de la base (filtrées par phase, "All Students", OU par utilisateur spécifique)
  const dbNotifs = await Notification.find({
    $or: [
      { relatedStep: currentStep, user: null },
      { relatedStep: "All Students", user: null },
      { user: user._id },
    ],
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

const markAllAsRead = async (user) => {
  const currentStep = getUserPhase(user);
  const notifications = await Notification.find({
    $or: [
      { relatedStep: currentStep, user: null },
      { relatedStep: "All Students", user: null },
      { user: user._id },
    ],
  });
  const allIds = notifications.map((n) => n._id);

  return await User.findByIdAndUpdate(
    user._id,
    { $addToSet: { readNotifications: { $each: allIds } } },
    { new: true },
  );
};

const markOneAsRead = async (user, notificationId) => {
  const currentStep = getUserPhase(user);
  const notification = await Notification.findOne({
    _id: notificationId,
    $or: [
      { relatedStep: currentStep, user: null },
      { relatedStep: "All Students", user: null },
      { user: user._id },
    ],
  });

  if (!notification) {
    throw new Error("Notification non autorisee");
  }

  return await User.findByIdAndUpdate(
    user._id,
    { $addToSet: { readNotifications: notificationId } },
    { new: true },
  );
};

const deleteOneNotification = async (notificationId, user, next) => {
  const notification = await Notification.findById(notificationId);
  
  if (notification && notification.isSystem && user.role !== "admin") {
    const error = new Error("Cette notification est protégée et ne peut pas être supprimée par un étudiant.");
    error.statusCode = 403;
    throw error;
  }

  if (user.role === "admin") {
    return await Notification.findByIdAndDelete(notificationId);
  }

  return await Notification.findOneAndDelete({
    _id: notificationId,
    user: user._id,
  });
};

const createNotification = async (data) => {
  const notification = new Notification(data);
  return await notification.save();
};

module.exports = {
  getNotificationsByStep,
  getSmartNotificationsForUser,
  markAllAsRead,
  markOneAsRead,
  deleteOneNotification,
  createNotification,
};
