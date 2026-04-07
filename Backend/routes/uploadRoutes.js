const express = require("express");
const router = express.Router();

const { uploadFile, upload, getAnalysisHistory, getAnalysisById, deleteAnalysis, getTopAnalyses } = require("../controllers/uploadController");

router.post("/upload", upload.single("resume"), uploadFile);

router.get("/analysis", getAnalysisHistory);
router.get("/analysis/top", getTopAnalyses);

router.get("/analysis/:id", getAnalysisById);

router.delete("/analysis/:id", deleteAnalysis);

module.exports = router;