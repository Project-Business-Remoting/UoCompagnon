const Content = require("../models/Content");
const Notification = require("../models/Notification");
const { calculateCurrentStep } = require("../config/constants");

// Ordre des phases pour le calcul de progression et le filtrage cumulatif
const PHASE_ORDER = [
  "Avant l'arrivée",
  "Semaine d'accueil",
  "Premier mois",
  "Mi-session",
];

/**
 * Récupère la phase actuelle de l'utilisateur
 */
const getUserPhase = (user) => {
  return calculateCurrentStep(user.arrivalDate, user.classStartDate);
};

/**
 * Calcule le pourcentage de progression dans le parcours étudiant
 * 0% = avant l'arrivée, 100% = mi-session atteinte
 */
const getPhaseProgress = (user) => {
  const now = new Date();
  const arrival = new Date(user.arrivalDate);
  const classes = new Date(user.classStartDate);
  const midSession = new Date(classes.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Avant même d'arriver : calculer le pourcentage en fonction du temps restant
  if (now < arrival) {
    // De l'inscription à l'arrivée → 0 à 25%
    const totalWait = arrival - user.createdAt;
    const elapsed = now - user.createdAt;
    return Math.min(25, Math.round((elapsed / totalWait) * 25));
  }

  // Semaine d'accueil : 25 à 50%
  if (now >= arrival && now < classes) {
    const totalAccueil = classes - arrival;
    const elapsed = now - arrival;
    return 25 + Math.round((elapsed / totalAccueil) * 25);
  }

  // Premier mois : 50 à 75%
  const diffFromClasses = Math.floor(
    (now - classes) / (1000 * 60 * 60 * 24)
  );
  if (diffFromClasses >= 0 && diffFromClasses <= 30) {
    return 50 + Math.round((diffFromClasses / 30) * 25);
  }

  // Mi-session et au-delà : 75 à 100%
  const daysAfterMonth = diffFromClasses - 30;
  return Math.min(100, 75 + Math.round((daysAfterMonth / 30) * 25));
};

/**
 * Récupère les contenus pertinents pour l'utilisateur
 * Inclut la phase actuelle + les phases précédentes (rattrapage)
 * Triés par priorité (Prioritaire → Moyen → Bas)
 */
const getRelevantContents = async (user) => {
  const currentStep = getUserPhase(user);
  const currentIndex = PHASE_ORDER.indexOf(currentStep);

  // Récupérer les phases courante + précédentes
  const relevantPhases = PHASE_ORDER.slice(0, currentIndex + 1);

  const contents = await Content.find({ step: { $in: relevantPhases } });

  // Tri par priorité puis par phase (phase courante en premier)
  const priorityWeight = { Prioritaire: 0, Moyen: 1, Bas: 2 };

  return contents.sort((a, b) => {
    // D'abord par phase (phase courante en premier)
    const phaseA = PHASE_ORDER.indexOf(a.step);
    const phaseB = PHASE_ORDER.indexOf(b.step);
    const phaseDiff = phaseB - phaseA; // Phase la plus récente en premier

    if (phaseDiff !== 0) return phaseDiff;

    // Ensuite par priorité
    return (priorityWeight[a.priority] || 1) - (priorityWeight[b.priority] || 1);
  });
};

/**
 * Génère des notifications intelligentes dynamiques basées sur le timing de l'étudiant
 * Ces notifications ne sont PAS persistées en base — elles sont calculées à la volée
 */
const generateSmartNotifications = (user) => {
  const now = new Date();
  const arrival = new Date(user.arrivalDate);
  const classes = new Date(user.classStartDate);
  const currentStep = getUserPhase(user);

  const diffToArrival = Math.ceil((arrival - now) / (1000 * 60 * 60 * 24));
  const diffToClasses = Math.ceil((classes - now) / (1000 * 60 * 60 * 24));
  const diffFromClasses = Math.floor((now - classes) / (1000 * 60 * 60 * 24));

  const smartNotifs = [];

  // --- Phase : Avant l'arrivée ---
  if (diffToArrival > 7 && diffToArrival <= 30) {
    smartNotifs.push({
      _id: "smart_arrival_30",
      title: "Prépare ton arrivée",
      message: `Tu arrives dans ${diffToArrival} jours au Canada. Commence à préparer ta checklist de départ !`,
      type: "info",
      relatedStep: "Avant l'arrivée",
      isSmartNotification: true,
    });
  }

  if (diffToArrival > 3 && diffToArrival <= 7) {
    smartNotifs.push({
      _id: "smart_arrival_7",
      title: " Ton arrivée approche !",
      message: `Plus que ${diffToArrival} jours ! Vérifie tes documents d'immigration, ton billet d'avion et ton logement.`,
      type: "warning",
      relatedStep: "Avant l'arrivée",
      isSmartNotification: true,
    });
  }

  if (diffToArrival >= 0 && diffToArrival <= 3) {
    smartNotifs.push({
      _id: "smart_arrival_3",
      title: " Dernière ligne droite !",
      message: `Tu arrives dans ${diffToArrival} jour(s) ! Assure-toi d'avoir ton passeport, ta lettre d'admission et ton assurance santé.`,
      type: "warning",
      relatedStep: "Avant l'arrivée",
      isSmartNotification: true,
    });
  }

  // --- Phase : Semaine d'accueil ---
  if (currentStep === "Semaine d'accueil") {
    smartNotifs.push({
      _id: "smart_welcome",
      title: " Bienvenue à Ottawa !",
      message: "Tu es arrivé(e) ! Consulte les événements de la semaine d'accueil et active ta carte étudiante.",
      type: "success",
      relatedStep: "Semaine d'accueil",
      isSmartNotification: true,
    });

    if (diffToClasses > 0 && diffToClasses <= 7) {
      smartNotifs.push({
        _id: "smart_classes_soon",
        title: " La rentrée approche !",
        message: `Les cours commencent dans ${diffToClasses} jour(s). Consulte ton horaire sur uoZone et repère tes salles de cours.`,
        type: "info",
        relatedStep: "Semaine d'accueil",
        isSmartNotification: true,
      });
    }
  }

  // --- Phase : Premier mois ---
  if (currentStep === "Premier mois") {
    if (diffFromClasses <= 7) {
      smartNotifs.push({
        _id: "smart_first_week",
        title: " Première semaine de cours",
        message: "Prends le temps de comprendre tes plans de cours et repère les dates importantes (examens, remises).",
        type: "info",
        relatedStep: "Premier mois",
        isSmartNotification: true,
      });
    }

    if (diffFromClasses >= 14 && diffFromClasses <= 21) {
      smartNotifs.push({
        _id: "smart_mid_month",
        title: " Mi-parcours du premier mois",
        message: "Tu es à mi-chemin de ton premier mois ! Vérifie tes notes et n'hésite pas à consulter les services de tutorat.",
        type: "info",
        relatedStep: "Premier mois",
        isSmartNotification: true,
      });
    }

    if (diffFromClasses >= 25) {
      smartNotifs.push({
        _id: "smart_gpa_reminder",
        title: "⚡ Pense à ton GPA",
        message: "La mi-session approche. Comprends le calcul du GPA et la notion de probation académique pour éviter les mauvaises surprises.",
        type: "warning",
        relatedStep: "Premier mois",
        isSmartNotification: true,
      });
    }
  }

  // --- Phase : Mi-session ---
  if (currentStep === "Mi-session") {
    smartNotifs.push({
      _id: "smart_mid_session",
      title: " Mi-session !",
      message: "C'est la période des examens de mi-session. Planifie tes révisions et utilise les ressources académiques disponibles.",
      type: "warning",
      relatedStep: "Mi-session",
      isSmartNotification: true,
    });

    smartNotifs.push({
      _id: "smart_plagiat",
      title: " Rappel : Intégrité académique",
      message: "Attention au plagiat ! Familiarise-toi avec les règles d'intégrité académique de l'uOttawa avant tes remises.",
      type: "warning",
      relatedStep: "Mi-session",
      isSmartNotification: true,
    });
  }

  return smartNotifs;
};

module.exports = {
  PHASE_ORDER,
  getUserPhase,
  getPhaseProgress,
  getRelevantContents,
  generateSmartNotifications,
};
