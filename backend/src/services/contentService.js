const Content = require("../models/Content");
const { getRelevantContents: getRelevantFromPhase } = require("./phaseService");

const getAllContents = async (step) => {
  const filter = step ? { step } : {};
  return await Content.find(filter);
};

const getContentById = async (id) => {
  return await Content.findById(id);
};

const createContent = async (contentData) => {
  return await Content.create(contentData);
};

const updateContent = async (id, contentData) => {
  return await Content.findByIdAndUpdate(id, contentData, { new: true });
};

const deleteContent = async (id) => {
  return await Content.findByIdAndDelete(id);
};

// Contenus contextuels filtrés automatiquement par la phase du user
const getRelevantForUser = async (user) => {
  return await getRelevantFromPhase(user);
};

module.exports = { 
  getAllContents, 
  getContentById, 
  createContent,
  updateContent,
  deleteContent,
  getRelevantForUser
};
