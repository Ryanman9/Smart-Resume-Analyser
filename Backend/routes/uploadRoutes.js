const express = require("express");
const router = express.Router();

const { uploadFile, upload } = require("../controllers/uploadController");

router.post("/upload", upload.single("resume"), uploadFile);

module.exports = router;