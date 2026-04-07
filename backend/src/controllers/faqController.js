const FAQ = require("../models/FAQ");

const getAllFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (err) {
    next(err);
  }
};

const createFAQ = async (req, res, next) => {
  try {
    const { question, answer, order } = req.body;
    if (!question?.fr || !question?.en || !answer?.fr || !answer?.en) {
      return res.status(400).json({ message: "La question et la réponse dans les deux langues sont obligatoires." });
    }
    const faq = await FAQ.create({ question, answer, order: order || 0 });
    res.status(201).json(faq);
  } catch (err) {
    next(err);
  }
};

const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
    if (!faq) return res.status(404).json({ message: "FAQ non trouvée" });
    res.json(faq);
  } catch (err) {
    next(err);
  }
};

const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ non trouvée" });
    res.json({ message: "FAQ supprimée avec succès" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllFAQs, createFAQ, updateFAQ, deleteFAQ };
