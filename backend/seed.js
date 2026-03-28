const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./src/models/User");
const Content = require("./src/models/Content");
const Notification = require("./src/models/Notification");
const connectDB = require("./src/config/db");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Vider la base de données avant d'insérer les données de test
    await User.deleteMany();
    await Content.deleteMany();
    await Notification.deleteMany();

    console.log("Base de données vidée...");

    // ===== UTILISATEURS =====

    // Étudiant de test (dates ajustées pour être en phase "Premier mois")
    const now = new Date();
    const arrivalDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000); // Arrivé il y a 15 jours
    const classStartDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // Cours commencés il y a 10 jours

    await User.create({
      name: "Amara",
      email: "amara@uottawa.ca",
      password: "password123",
      role: "student",
      program: "B.Sc. Computer Science",
      arrivalDate,
      classStartDate,
    });

    // Administrateur de test
    await User.create({
      name: "Admin UO",
      email: "admin@uottawa.ca",
      password: "admin123",
      role: "admin",
      program: "Administration",
      arrivalDate: new Date("2020-01-01"),
      classStartDate: new Date("2020-01-15"),
    });

    console.log("Utilisateurs créés (étudiant + admin)...");

    // ===== CONTENUS — Toutes les phases =====
    await Content.insertMany([
      // --- Avant l'arrivée ---
      {
        title: "Trouver son logement",
        description:
          "Guide complet des résidences universitaires et du logement hors-campus à Ottawa. Comparatif des quartiers, prix moyens et conseils pratiques.",
        category: "Vie étudiante",
        step: "Avant l'arrivée",
        priority: "Prioritaire",
        tags: ["logement", "résidence", "quartiers"],
      },
      {
        title: "Préparer ses documents d'immigration",
        description:
          "Checklist des documents essentiels : permis d'études, visa, passeport, lettre d'admission, preuve de fonds financiers.",
        category: "Administratif",
        step: "Avant l'arrivée",
        priority: "Prioritaire",
        tags: ["visa", "immigration", "documents"],
      },
      {
        title: "Souscrire à une assurance santé",
        description:
          "Le régime d'assurance santé RAÉO (UHIP) est obligatoire pour les étudiants internationaux. Voici comment s'inscrire.",
        category: "Santé",
        step: "Avant l'arrivée",
        priority: "Moyen",
        tags: ["assurance", "UHIP", "santé"],
      },
      {
        title: "Préparer son budget",
        description:
          "Estimation des coûts de la vie à Ottawa : loyer, transport, alimentation, manuels. Conseils pour gérer son budget.",
        category: "Vie étudiante",
        step: "Avant l'arrivée",
        priority: "Moyen",
        tags: ["budget", "finances", "coût de la vie"],
      },

      // --- Semaine d'accueil ---
      {
        title: "Activer sa carte étudiante",
        description:
          "Rendez-vous au Centre universitaire pour obtenir et activer ta carte étudiante. Elle sert de carte d'accès, de bibliothèque et de transport.",
        category: "Administratif",
        step: "Semaine d'accueil",
        priority: "Prioritaire",
        tags: ["carte étudiante", "uOttawa"],
      },
      {
        title: "Configurer uoZone et Brightspace",
        description:
          "Guide pour accéder à uoZone (portail administratif), Brightspace (cours en ligne) et configurer ton email universitaire.",
        category: "Académique",
        step: "Semaine d'accueil",
        priority: "Prioritaire",
        tags: ["uoZone", "Brightspace", "email"],
      },
      {
        title: "Événements d'orientation",
        description:
          "Calendrier des événements de la semaine 101 : visites du campus, rencontres avec les associations, foire aux clubs.",
        category: "Vie étudiante",
        step: "Semaine d'accueil",
        priority: "Moyen",
        tags: ["orientation", "semaine 101", "clubs"],
      },
      {
        title: "Transport à Ottawa",
        description:
          "Le U-Pass est inclus dans tes frais de scolarité. Voici comment utiliser OC Transpo et l'O-Train pour te déplacer.",
        category: "Vie étudiante",
        step: "Semaine d'accueil",
        priority: "Bas",
        tags: ["transport", "U-Pass", "OC Transpo"],
      },

      // --- Premier mois ---
      {
        title: "Comprendre ton plan de cours",
        description:
          "Comment lire un syllabus, identifier les dates d'examens, les pondérations et les attendus des professeurs.",
        category: "Académique",
        step: "Premier mois",
        priority: "Prioritaire",
        tags: ["syllabus", "cours", "évaluation"],
      },
      {
        title: "Santé et Bien-être",
        description:
          "Services de la clinique universitaire, support psychologique gratuit et ressources de bien-être disponibles sur le campus.",
        category: "Santé",
        step: "Premier mois",
        priority: "Prioritaire",
        tags: ["clinique", "psychologue", "bien-être"],
        details: {
          availableServices: [
            "Clinique médicale du campus",
            "Service de counseling",
            "Ligne d'écoute 24/7",
          ],
          emergencyContacts: [
            { name: "Urgences campus", phone: "613-562-5411" },
            { name: "Ligne de crise", phone: "1-866-996-0991" },
          ],
        },
      },
      {
        title: "Services de tutorat et aide académique",
        description:
          "Le Centre d'aide à la rédaction, le mentorat par les pairs et les ateliers de méthodes d'étude sont disponibles gratuitement.",
        category: "Académique",
        step: "Premier mois",
        priority: "Moyen",
        tags: ["tutorat", "aide", "mentorat"],
      },
      {
        title: "Explorer les clubs et associations",
        description:
          "Plus de 250 clubs étudiants à uOttawa. Sport, culture, technologie, bénévolat — trouve ta communauté.",
        category: "Vie étudiante",
        step: "Premier mois",
        priority: "Bas",
        tags: ["clubs", "associations", "communauté"],
      },

      // --- Mi-session ---
      {
        title: "Comprendre le calcul du GPA",
        description:
          "Le GPA (Grade Point Average) se calcule sur une échelle de 10 à uOttawa. Voici comment le calculer et ce que signifie la probation académique.",
        category: "Académique",
        step: "Mi-session",
        priority: "Prioritaire",
        tags: ["GPA", "notes", "probation"],
      },
      {
        title: "Intégrité académique et plagiat",
        description:
          "Les règles de l'uOttawa sur le plagiat, la fraude et la collaboration inappropriée. Conséquences et comment éviter les erreurs.",
        category: "Académique",
        step: "Mi-session",
        priority: "Prioritaire",
        tags: ["plagiat", "intégrité", "règlement"],
      },
      {
        title: "Planifier ses révisions",
        description:
          "Techniques de révision efficaces : méthode Pomodoro, cartes mémoire, groupes d'étude. Accès aux salles d'étude sur le campus.",
        category: "Académique",
        step: "Mi-session",
        priority: "Moyen",
        tags: ["révision", "examens", "étude"],
      },
      {
        title: "Abandon de cours sans pénalité",
        description:
          "Date limite pour abandonner un cours sans mention au relevé de notes. Comment évaluer si tu devrais abandonner un cours.",
        category: "Administratif",
        step: "Mi-session",
        priority: "Moyen",
        tags: ["abandon", "cours", "date limite"],
      },
    ]);

    console.log("Contenus créés (16 contenus, 4 par phase)...");

    // ===== NOTIFICATIONS PERSISTANTES =====
    await Notification.insertMany([
      {
        title: "Bienvenue sur UO-Compagnon !",
        message:
          "Ta plateforme d'accompagnement est prête. Explore les contenus adaptés à ta phase actuelle.",
        date: new Date().toISOString(),
        type: "success",
        relatedStep: "Avant l'arrivée",
      },
      {
        title: "Date limite d'inscription aux cours",
        message:
          "N'oublie pas de finaliser ton choix de cours avant la date limite sur uoZone.",
        date: new Date().toISOString(),
        type: "warning",
        relatedStep: "Semaine d'accueil",
      },
      {
        title: "Premier devoir à remettre",
        message:
          "Vérifie les dates de remise sur Brightspace. La plupart des premiers devoirs sont dus dans les 2-3 premières semaines.",
        date: new Date().toISOString(),
        type: "info",
        relatedStep: "Premier mois",
      },
      {
        title: "Examens de mi-session",
        message:
          "La période d'examens de mi-session commence bientôt. Consulte ton horaire d'examens sur uoZone.",
        date: new Date().toISOString(),
        type: "warning",
        relatedStep: "Mi-session",
      },
    ]);

    console.log("Notifications créées (4 notifications)...");

    console.log("\n Seed complet ! Données injectées avec succès.");
    console.log("   → 2 utilisateurs (1 étudiant + 1 admin)");
    console.log("   → 16 contenus (4 par phase)");
    console.log("   → 4 notifications persistantes");
    console.log("\n Comptes de test :");
    console.log("   Étudiant : amara@uottawa.ca / password123");
    console.log("   Admin    : admin@uottawa.ca / admin123");

    process.exit();
  } catch (error) {
    console.error(`Erreur : ${error.message}`);
    process.exit(1);
  }
};

seedData();
