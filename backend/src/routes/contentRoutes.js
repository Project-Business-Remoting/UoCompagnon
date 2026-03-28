const express = require("express");
const router = express.Router();
const { 
  getContents, 
  addContent,
  updateContent,
  deleteContent 
} = require("../controllers/contentController");

router.get("/", getContents);
router.post("/", addContent);
router.put("/:id", updateContent);
router.delete("/:id", deleteContent);

module.exports = router;
