const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Private notification if specified
    title: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleDateString() },
    type: {
      type: String,
      enum: ["info", "warning", "success"],
      default: "info",
    },
    relatedStep: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
