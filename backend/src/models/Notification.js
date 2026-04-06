const mongoose = require("mongoose");

const textSchema = {
  fr: { type: String, required: true },
  en: { type: String, required: true },
};

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Private notification if specified
    title: textSchema,
    message: textSchema,
    date: { type: String, default: () => new Date().toLocaleDateString() },
    type: {
      type: String,
      enum: ["info", "warning", "success"],
      default: "info",
    },
    relatedStep: { type: String, required: true },
    actionUrl: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
