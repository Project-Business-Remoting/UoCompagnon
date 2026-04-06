const contentService = require("../services/contentService");
const notificationService = require("../services/notificationService");
const { getIO } = require("../config/socket");

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

    // Créer automatiquement une notification pour prévenir les étudiants
    const titleObj = content.title || {};
    const notifData = {
      title: {
        fr: `Nouveau contenu : ${titleObj.fr || titleObj.en || ""}`,
        en: `New content: ${titleObj.en || titleObj.fr || ""}`,
      },
      message: {
        fr: `Un nouveau contenu a été ajouté pour la phase "${content.step}". Consultez-le dans votre espace contenus.`,
        en: `New content has been added for the "${content.step}" phase. Check it out in your content hub.`,
      },
      type: "info",
      relatedStep: content.step,
      date: new Date().toISOString(),
    };
    const notification = await notificationService.createNotification(notifData);

    // Emit WebSocket event
    try {
      const io = getIO();
      io.emit("new-notification", notification);
    } catch (socketErr) {
      console.error("[Socket.IO] Failed to emit content notification:", socketErr.message);
    }

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
