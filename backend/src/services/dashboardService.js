const User = require("../models/User");
const Content = require("../models/Content");
const Notification = require("../models/Notification");
const Question = require("../models/Question");
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

  // 2. Notifications persistantes non lues (Phase + Privées)
  const dbNotifications = await Notification.find({
    $or: [
      { relatedStep: currentStep, user: null },
      { user: user._id }
    ]
  });
  const readIds = user.readNotifications.map((id) => id.toString());
  const unreadDbNotifs = dbNotifications.filter(
    (n) => !readIds.includes(n._id.toString())
  );

  // 3. Formatter pour le dashboard (combiner smart + DB unread)
  // On les met tous dans 'smart' car c'est ce que consomme le Dashboard.jsx
  const allRecentNotifs = [
    ...smartNotifications,
    ...unreadDbNotifs.map(n => ({
      ...n.toObject(),
      isSmartNotification: false,
      isRead: false
    }))
  ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

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
      smart: allRecentNotifs.slice(0, 5),
      unread: unreadDbNotifs.length,
      total: smartNotifications.length + unreadDbNotifs.length,
    },
    actions: recommendedActions,
  };
};



// Status weight for sorting
const STATUS_WEIGHT = {
  'New': 0,
  'In Progress': 1,
  'Answered': 2
};

/**
 * Dashboard admin — Statistiques globales de la plateforme
 */
const getAdminDashboard = async () => {
  const totalUsers = await User.countDocuments({ role: "student" });
  const totalContents = await Content.countDocuments();
  const totalNotifications = await Notification.countDocuments();

  // Utilisateurs récents (5 derniers inscrits)
  const recentUsers = await User.find({ role: "student" })
    .select("name email program createdAt arrivalDate classStartDate")
    .sort({ createdAt: -1 })
    .limit(5);

  const mappedRecentUsers = recentUsers.map(u => {
    const obj = u.toObject();
    obj.currentStep = getUserPhase(u);
    return obj;
  });

  // Questions récentes pour l'admin (les "notifications" métier pour l'admin)
  const recentQuestions = await Question.find()
    .populate('author', 'name email profileImage')
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    stats: {
      totalUsers,
      totalContents,
      totalNotifications,
    },
    recentUsers: mappedRecentUsers,
    recentQuestions: recentQuestions.map(q => ({
      _id: q._id,
      subject: q.subject,
      author: q.isAnonymous ? 'Anonymous' : (q.author?.name || 'Unknown'),
      status: q.status,
      createdAt: q.createdAt,
      type: q.isAnonymous ? 'Anonymous' : 'Direct'
    }))
  };
};

/**
 * Actions recommandées selon la phase
 */
const getRecommendedActions = (step) => {
  const actions = {
    "Before Arrival": [
      { label: "Check your visa and documents", done: false },
      { label: "Secure your accommodation", done: false },
      { label: "Enroll in a health insurance plan", done: false },
      { label: "Pack your bags", done: false },
    ],
    "Welcome Week": [
      { label: "Activate your student card", done: false },
      { label: "Participate in orientation events", done: false },
      { label: "Set up your uoZone and Brightspace access", done: false },
      { label: "Find your classrooms on campus", done: false },
    ],
    "First Month": [
      { label: "Understand your course syllabi", done: false },
      { label: "Identify tutoring services", done: false },
      { label: "Check out student clubs and associations", done: false },
      { label: "Schedule an appointment with an academic advisor", done: false },
    ],
    "Mid-Term": [
      { label: "Organize study groups for exams", done: false },
      { label: "Understand GPA calculations", done: false },
      { label: "Review academic integrity rules", done: false },
      { label: "Check course drop deadlines", done: false },
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
