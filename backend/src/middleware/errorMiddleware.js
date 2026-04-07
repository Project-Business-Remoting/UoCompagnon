/**
 * Centralized Error Handling Middleware
 * Translates technical database errors into user-friendly French messages.
 */

const FIELD_TRANSLATIONS = {
  email: "Email",
  password: "Mot de passe",
  title: "Titre",
  description: "Description",
  articleBody: "Corps de l'article",
  step: "Phase/Étape",
  question: "Question",
  answer: "Réponse",
  program: "Programme académique",
  arrivalDate: "Date d'arrivée",
  classStartDate: "Date de rentrée",
  fr: "français",
  en: "anglais",
  relatedStep: "Étape associée",
};

const translatePath = (path) => {
  const parts = path.split('.');
  return parts.map(part => FIELD_TRANSLATIONS[part] || part).join(' ');
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for developers (can be connected to a logging service)
  console.error(`[Error Handler] ${err.name}: ${err.message}`);

  // 1. Mongoose Validation Error (required fields, enum, etc.)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => {
      const path = translatePath(val.path);
      if (val.kind === 'required') return `Le champ "${path}" est obligatoire.`;
      if (val.kind === 'enum') return `La valeur pour "${path}" n'est pas autorisée.`;
      return val.message;
    });
    return res.status(400).json({ 
      success: false, 
      message: messages.join(' ') 
    });
  }

  // 2. Mongoose Duplicate Key Error (e.g., email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const translatedField = translatePath(field);
    return res.status(400).json({ 
      success: false, 
      message: `Cette valeur pour "${translatedField}" est déjà utilisée.` 
    });
  }

  // 3. Mongoose Cast Error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(404).json({ 
      success: false, 
      message: "Ressource non trouvée (ID invalide)." 
    });
  }

  // 4. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      success: false, 
      message: "Session invalide. Veuillez vous reconnecter." 
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      success: false, 
      message: "Votre session a expiré. Veuillez vous reconnecter." 
    });
  }

  // 5. Default Generic Error
  const statusCode = error.statusCode || (error.message.includes("invalide") || error.message.includes("existant") || error.message.includes("trouvé") ? 400 : 500);
  const message = statusCode === 500 
    ? "Une erreur interne s'est produite. Veuillez réessayer plus tard." 
    : error.message;

  res.status(statusCode).json({
    success: false,
    message: message
  });
};

module.exports = errorHandler;
