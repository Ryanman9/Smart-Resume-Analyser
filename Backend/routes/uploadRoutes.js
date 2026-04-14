const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { uploadFile, upload, getAnalysisHistory, getAnalysisById, deleteAnalysis, getTopAnalyses } = require("../controllers/uploadController");

router.post("/upload", authMiddleware, upload.single("resume"), uploadFile);

router.get("/analysis", authMiddleware, getAnalysisHistory);
router.get("/analysis/top", authMiddleware, getTopAnalyses);

router.get("/analysis/:id", authMiddleware, getAnalysisById);

router.delete("/analysis/:id", authMiddleware, deleteAnalysis);

module.exports = router;