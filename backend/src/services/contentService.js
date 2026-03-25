const Content = require("../models/Content");

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

module.exports = { getAllContents, getContentById, createContent };
