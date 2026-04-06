const Content = require("../models/Content");
const Notification = require("../models/Notification");
const { calculateCurrentStep } = require("../config/constants");

// Ordre des phases pour le calcul de progression et le filtrage cumulatif
const PHASE_ORDER = [
  "Before Arrival",
  "Welcome Week",
  "First Month",
  "Mid-Term",
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
  const priorityWeight = { High: 0, Medium: 1, Low: 2 };

  return contents.sort((a, b) => {
    // D'abord par phase (phase courante en premier)
    const phaseA = PHASE_ORDER.indexOf(a.step);
    const phaseB = PHASE_ORDER.indexOf(b.step);
    const phaseDiff = phaseB - phaseA; // Phase la plus récente en premier

    if (phaseDiff !== 0) return phaseDiff;

    // Ensuite par priorité
    return (priorityWeight[a.priority] ?? 1) - (priorityWeight[b.priority] ?? 1);
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

  // --- Phase : Before Arrival ---
  if (diffToArrival > 7 && diffToArrival <= 30) {
    smartNotifs.push({
      _id: "smart_arrival_30",
      title: { 
        fr: "Préparez votre arrivée", 
        en: "Prepare your arrival" 
      },
      message: { 
        fr: `Vous arrivez dans ${diffToArrival} jours au Canada. Commencez votre check-list !`, 
        en: `You're arriving in ${diffToArrival} days in Canada. Start preparing your departure checklist!` 
      },
      type: "info",
      relatedStep: "Before Arrival",
      isSmartNotification: true,
    });
  }

  if (diffToArrival > 3 && diffToArrival <= 7) {
    smartNotifs.push({
      _id: "smart_arrival_7",
      title: { 
        fr: "Votre arrivée approche !", 
        en: "Your arrival is approaching!" 
      },
      message: { 
        fr: `Plus que ${diffToArrival} jours ! Vérifiez vos documents d'immigration et logement.`, 
        en: `Only ${diffToArrival} days left! Check your immigration documents, flight ticket, and housing.` 
      },
      type: "warning",
      relatedStep: "Before Arrival",
      isSmartNotification: true,
    });
  }

  if (diffToArrival >= 0 && diffToArrival <= 3) {
    smartNotifs.push({
      _id: "smart_arrival_3",
      title: { 
        fr: "Dernière ligne droite !", 
        en: "Final Stretch!" 
      },
      message: { 
        fr: `Vous arrivez dans ${diffToArrival} jour(s) ! Assurez-vous d'avoir votre passeport et lettre d'admission.`, 
        en: `You're arriving in ${diffToArrival} day(s)! Make sure you have your passport, admission letter, and health insurance.` 
      },
      type: "warning",
      relatedStep: "Before Arrival",
      isSmartNotification: true,
    });
  }

  // --- Phase : Welcome Week ---
  if (currentStep === "Welcome Week") {
    smartNotifs.push({
      _id: "smart_welcome",
      title: { 
        fr: "Bienvenue à Ottawa !", 
        en: "Welcome to Ottawa!" 
      },
      message: { 
        fr: "Vous êtes arrivé ! Profitez de la semaine d'accueil et activez votre carte étudiante.", 
        en: "You have arrived! Check out the welcome week events and activate your student card." 
      },
      type: "success",
      relatedStep: "Welcome Week",
      isSmartNotification: true,
    });

    if (diffToClasses > 0 && diffToClasses <= 7) {
      smartNotifs.push({
        _id: "smart_classes_soon",
        title: { 
          fr: "Les cours commencent bientôt !", 
          en: "Classes are starting soon!" 
        },
        message: { 
          fr: `Les cours débutent dans ${diffToClasses} jour(s). Vérifiez votre horaire sur uoZone.`, 
          en: `Classes start in ${diffToClasses} day(s). Check your schedule on uoZone and find your classrooms.` 
        },
        type: "info",
        relatedStep: "Welcome Week",
        isSmartNotification: true,
      });
    }
  }

  // --- Phase : First Month ---
  if (currentStep === "First Month") {
    if (diffFromClasses <= 7) {
      smartNotifs.push({
        _id: "smart_first_week",
        title: { 
          fr: "Première semaine de cours", 
          en: "First week of classes" 
        },
        message: { 
          fr: "Prenez le temps de comprendre vos plans de cours et notez les dates importantes.", 
          en: "Take time to understand your course syllabi and identify important dates (exams, assignments)." 
        },
        type: "info",
        relatedStep: "First Month",
        isSmartNotification: true,
      });
    }

    if (diffFromClasses >= 14 && diffFromClasses <= 21) {
      smartNotifs.push({
        _id: "smart_mid_month",
        title: { 
          fr: "Mi-parcours du premier mois", 
          en: "Mid-way through the first month" 
        },
        message: { 
          fr: "Déjà deux semaines ! N'hésitez pas à consulter les services de tutorat si besoin.", 
          en: "You're halfway through your first month! Check your notes and don't hesitate to consult tutoring services." 
        },
        type: "info",
        relatedStep: "First Month",
        isSmartNotification: true,
      });
    }

    if (diffFromClasses >= 25) {
      smartNotifs.push({
        _id: "smart_gpa_reminder",
        title: { 
          fr: "⚡ Pensez à votre moyenne (GPA)", 
          en: "⚡ Think about your GPA" 
        },
        message: { 
          fr: "Les examens partiels approchent. Comprenez le calcul du GPA pour éviter les surprises.", 
          en: "Midterms are approaching. Understand GPA calculation and academic probation to avoid surprises." 
        },
        type: "warning",
        relatedStep: "First Month",
        isSmartNotification: true,
      });
    }
  }

  // --- Phase : Mid-Term ---
  if (currentStep === "Mid-Term") {
    smartNotifs.push({
      _id: "smart_mid_session",
      title: { 
        fr: "Mi-session !", 
        en: "Mid-Term!" 
      },
      message: { 
        fr: "C'est la période des examens. Planifiez vos révisions et utilisez les ressources académiques.", 
        en: "It's the midterm exam period. Plan your revisions and use the available academic resources." 
      },
      type: "warning",
      relatedStep: "Mid-Term",
      isSmartNotification: true,
    });

    smartNotifs.push({
      _id: "smart_plagiat",
      title: { 
        fr: "Rappel : Intégrité Académique", 
        en: "Reminder: Academic Integrity" 
      },
      message: { 
        fr: "Attention au plagiat ! Familiarisez-vous avec les règles de l'uOttawa avant vos remises.", 
        en: "Beware of plagiarism! Familiarize yourself with uOttawa's academic integrity rules before your submissions." 
      },
      type: "warning",
      relatedStep: "Mid-Term",
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
