const contentService = require("../services/contentService");

const getContents = async (req, res) => {
  try {
    const { step } = req.query; // ex: ?step=Premier mois
    const contents = await contentService.getAllContents(step);
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addContent = async (req, res) => {
  try {
    const content = await contentService.createContent(req.body);
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateContent = async (req, res) => {
  try {
    const content = await contentService.updateContent(req.params.id, req.body);
    if (!content) return res.status(404).json({ message: "Contenu non trouvé" });
    res.json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteContent = async (req, res) => {
  try {
    const content = await contentService.deleteContent(req.params.id);
    if (!content) return res.status(404).json({ message: "Contenu non trouvé" });
    res.json({ message: "Contenu supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Contenus contextuels — auto-filtrés par la phase de l'utilisateur connecté
const getRelevantContents = async (req, res) => {
  try {
    const contents = await contentService.getRelevantForUser(req.user);
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getContents, addContent, updateContent, deleteContent, getRelevantContents };
