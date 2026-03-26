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

    // Utilisateur de test
    await User.create({
      name: "Amara",
      email: "amara@uottawa.ca",
      password: "password123",
      program: "B.Sc. Computer Science",
      arrivalDate: new Date("2026-08-25"),
      classStartDate: new Date("2026-09-02"),
    });

    // Contenus de test
    await Content.insertMany([
      {
        title: "Trouver son logement",
        description: "Guide complet des résidences et du logement hors-campus.",
        category: "Vie étudiante",
        step: "Avant l'arrivée",
        priority: "Prioritaire",
      },
      {
        title: "Santé et Bien-être",
        description: "Services de clinique et support psychologique.",
        category: "Santé",
        step: "Premier mois",
        priority: "Prioritaire",
      },
    ]);

    console.log("Données injectées avec succès !");
    process.exit();
  } catch (error) {
    console.error(`Erreur : ${error.message}`);
    process.exit(1);
  }
};

seedData();
