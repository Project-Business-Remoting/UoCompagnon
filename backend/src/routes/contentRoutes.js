const express = require("express");
const router = express.Router();
const { getContents, addContent } = require("../controllers/contentController");

router.get("/", getContents);
router.post("/", addContent);

module.exports = router;
