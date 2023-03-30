const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");

// Route for uploading a file
router.post("/api/upload", uploadController.upload);

module.exports = router;
