const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, required: true },
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
