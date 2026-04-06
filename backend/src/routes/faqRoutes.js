const express = require("express");
const router = express.Router();
const { getAllFAQs, createFAQ, updateFAQ, deleteFAQ } = require("../controllers/faqController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

// Public: any authenticated user can read FAQs
router.get("/", protect, getAllFAQs);

// Admin only: create, update, delete
router.post("/", protect, adminProtect, createFAQ);
router.put("/:id", protect, adminProtect, updateFAQ);
router.delete("/:id", protect, adminProtect, deleteFAQ);

module.exports = router;
