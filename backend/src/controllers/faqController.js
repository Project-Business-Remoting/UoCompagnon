const FAQ = require("../models/FAQ");

const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch FAQs", error: err.message });
  }
};

const createFAQ = async (req, res) => {
  try {
    const { question, answer, order } = req.body;
    if (!question?.fr || !question?.en || !answer?.fr || !answer?.en) {
      return res.status(400).json({ message: "Question and answer in both languages are required" });
    }
    const faq = await FAQ.create({ question, answer, order: order || 0 });
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ message: "Failed to create FAQ", error: err.message });
  }
};

const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json(faq);
  } catch (err) {
    res.status(400).json({ message: "Failed to update FAQ", error: err.message });
  }
};

const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json({ message: "FAQ deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete FAQ", error: err.message });
  }
};

module.exports = { getAllFAQs, createFAQ, updateFAQ, deleteFAQ };
