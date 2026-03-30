const express = require("express");
const router = express.Router();
const {
  getContents,
  addContent,
  updateContent,
  deleteContent,
  getRelevantContents,
} = require("../controllers/contentController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

router.get("/", protect, getContents);
router.get("/relevant", protect, getRelevantContents); // Auto-filtre par phase du user
router.post("/", protect, adminProtect, addContent);
router.put("/:id", protect, adminProtect, updateContent);
router.delete("/:id", protect, adminProtect, deleteContent);

module.exports = router;
