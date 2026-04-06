const mongoose = require("mongoose");

const textSchema = {
  fr: { type: String, required: true },
  en: { type: String, required: true },
};

const faqSchema = new mongoose.Schema(
  {
    question: textSchema,
    answer: textSchema,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FAQ", faqSchema);
