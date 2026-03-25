const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    step: {
      type: String,
      enum: [
        "Avant l'arrivée",
        "Semaine d'accueil",
        "Premier mois",
        "Mi-session",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Prioritaire", "Moyen", "Bas"],
      default: "Moyen",
    },
    tags: [String],
    details: {
      availableServices: [String],
      emergencyContacts: [{ name: String, phone: String }],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Content", contentSchema);
