const contentService = require("../services/contentService");
const notificationService = require("../services/notificationService");
const { getIO } = require("../config/socket");

const getContents = async (req, res, next) => {
  try {
    const { step } = req.query; // ex: ?step=Premier mois
    const contents = await contentService.getAllContents(step);
    res.json(contents);
  } catch (error) {
    next(error);
  }
};

const addContent = async (req, res, next) => {
  try {
    const content = await contentService.createContent(req.body);

    // ... notification logic ...
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
      isSystem: true,
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
    next(error);
  }
};

const updateContent = async (req, res, next) => {
  try {
    const content = await contentService.updateContent(req.params.id, req.body);
    if (!content) return res.status(404).json({ message: "Contenu non trouvé" });
    res.json(content);
  } catch (error) {
    next(error);
  }
};

const deleteContent = async (req, res, next) => {
  try {
    const content = await contentService.deleteContent(req.params.id);
    if (!content) return res.status(404).json({ message: "Contenu non trouvé" });
    res.json({ message: "Contenu supprimé avec succès" });
  } catch (error) {
    next(error);
  }
};

// Contenus contextuels — auto-filtrés par la phase de l'utilisateur connecté
const getRelevantContents = async (req, res, next) => {
  try {
    const contents = await contentService.getRelevantForUser(req.user);
    res.json(contents);
  } catch (error) {
    next(error);
  }
};

module.exports = { getContents, addContent, updateContent, deleteContent, getRelevantContents };
