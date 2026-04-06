const mongoose = require("mongoose");

const textSchema = {
  fr: { type: String, required: true },
  en: { type: String, required: true },
};

const contentSchema = new mongoose.Schema(
  {
    title: textSchema,
    description: textSchema,
    articleBody: textSchema,
    category: { type: String, required: true },
    step: {
      type: String,
      enum: [
        "Before Arrival",
        "Welcome Week",
        "First Month",
        "Mid-Term",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
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
