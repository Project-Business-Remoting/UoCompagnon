const User = require("../models/User");
const Content = require("../models/Content");
const Notification = require("../models/Notification");
const {
  getUserPhase,
  getPhaseProgress,
  getRelevantContents,
  generateSmartNotifications,
  PHASE_ORDER,
} = require("./phaseService");

/**
 * Dashboard étudiant — Agrège toutes les données contextuelles en un seul appel
 */
const getStudentDashboard = async (user) => {
  const currentStep = getUserPhase(user);
  const progress = getPhaseProgress(user);

  // Contenus pertinents (phase courante + précédentes, triés par priorité)
  const relevantContents = await getRelevantContents(user);

  // Notifications dynamiques
  const smartNotifications = generateSmartNotifications(user);

  // Notifications persistantes non lues
  const dbNotifications = await Notification.find({ relatedStep: currentStep });
  const readIds = user.readNotifications.map((id) => id.toString());
  const unreadDbNotifs = dbNotifications.filter(
    (n) => !readIds.includes(n._id.toString())
  );

  // Contenus prioritaires (top 5 de la phase actuelle)
  const priorityContents = relevantContents
    .filter((c) => c.step === currentStep)
    .slice(0, 5);

  // Actions recommandées basées sur la phase
  const recommendedActions = getRecommendedActions(currentStep);

  return {
    user: {
      name: user.name,
      program: user.program,
      arrivalDate: user.arrivalDate,
      classStartDate: user.classStartDate,
    },
    phase: {
      current: currentStep,
      progress,
      phaseIndex: PHASE_ORDER.indexOf(currentStep),
      totalPhases: PHASE_ORDER.length,
    },
    contents: {
      priority: priorityContents,
      total: relevantContents.length,
      byCategory: groupByCategory(relevantContents),
    },
    notifications: {
      smart: smartNotifications,
      unread: unreadDbNotifs.length,
      total: smartNotifications.length + unreadDbNotifs.length,
    },
    actions: recommendedActions,
  };
};

/**
 * Dashboard admin — Statistiques globales de la plateforme
 */
const getAdminDashboard = async () => {
  const totalUsers = await User.countDocuments({ role: "student" });
  const totalContents = await Content.countDocuments();
  const totalNotifications = await Notification.countDocuments();

  // Distribution des contenus par phase
  const contentsByPhase = await Content.aggregate([
    { $group: { _id: "$step", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  // Distribution des contenus par catégorie
  const contentsByCategory = await Content.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Distribution des contenus par priorité
  const contentsByPriority = await Content.aggregate([
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);

  // Utilisateurs récents (5 derniers inscrits)
  const recentUsers = await User.find({ role: "student" })
    .select("name email program createdAt")
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    stats: {
      totalUsers,
      totalContents,
      totalNotifications,
    },
    distributions: {
      contentsByPhase: contentsByPhase.map((p) => ({
        phase: p._id,
        count: p.count,
      })),
      contentsByCategory: contentsByCategory.map((c) => ({
        category: c._id,
        count: c.count,
      })),
      contentsByPriority: contentsByPriority.map((p) => ({
        priority: p._id,
        count: p.count,
      })),
    },
    recentUsers,
  };
};

/**
 * Actions recommandées selon la phase
 */
const getRecommendedActions = (step) => {
  const actions = {
    "Avant l'arrivée": [
      { label: "Vérifie ton visa et tes documents", done: false },
      { label: "Réserve ton logement", done: false },
      { label: "Souscris à une assurance santé", done: false },
      { label: "Prépare ta valise", done: false },
    ],
    "Semaine d'accueil": [
      { label: "Active ta carte étudiante", done: false },
      { label: "Participe aux événements d'orientation", done: false },
      { label: "Configure ton accès uoZone et Brightspace", done: false },
      { label: "Repère tes salles de cours", done: false },
    ],
    "Premier mois": [
      { label: "Comprends tes plans de cours", done: false },
      { label: "Identifie les services de tutorat", done: false },
      { label: "Consulte les clubs et associations", done: false },
      { label: "Prends rendez-vous avec ton conseiller académique", done: false },
    ],
    "Mi-session": [
      { label: "Vérifie ton GPA actuel", done: false },
      { label: "Planifie tes révisions pour les examens", done: false },
      { label: "Révise les règles d'intégrité académique", done: false },
      { label: "Consulte les services de bien-être", done: false },
    ],
  };

  return actions[step] || [];
};

/**
 * Grouper les contenus par catégorie
 */
const groupByCategory = (contents) => {
  const groups = {};
  contents.forEach((c) => {
    if (!groups[c.category]) groups[c.category] = 0;
    groups[c.category]++;
  });
  return Object.entries(groups).map(([category, count]) => ({ category, count }));
};

module.exports = { getStudentDashboard, getAdminDashboard };
