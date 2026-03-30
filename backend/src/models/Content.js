const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    articleBody: { type: String, required: true },
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
