const express = require("express");
const router = express.Router();
const { 
  getContents, 
  addContent,
  updateContent,
  deleteContent,
  getRelevantContents
} = require("../controllers/contentController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getContents);
router.get("/relevant", protect, getRelevantContents); // Auto-filtre par phase du user
router.post("/", addContent);
router.put("/:id", updateContent);
router.delete("/:id", deleteContent);

module.exports = router;
