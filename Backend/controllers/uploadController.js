const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const analyzeResume = require("../services/analyzeService");
const Analysis = require("../models/Analysis");

// Storage config

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads/");
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({storage: storage});

const uploadFile = async(req, res) =>{
    try{
        const filePath = req.file.path;

        // Read File
        const dataBuffer = fs.readFileSync(filePath);

        // Extract text
        const data = await pdfParse(dataBuffer);

        const jobDescription = req.body.jobDescription;

        const analysis = analyzeResume(data.text, jobDescription);

        const savedAnalysis = await Analysis.create({
            resumeText : data.text,
            jobDescription : jobDescription,
            matchedKeywords : analysis.matchedKeywords,
            missingKeywords : analysis.missingKeywords,
            matchedPhrases : analysis.matchedPhrases,
            score : analysis.score
        });

        res.json({
            message:"File uploaded and analyzed successfully",
            analysis: savedAnalysis
        });
    }
    catch(error){
        console.error(error);
        res.status(500).send("Error processing file");
    }
};

const getAnalysisHistory = async (req, res) => {
    try{
        const history = await Analysis.find().sort({ createdAt : -1});
        res.json(history);
    }
    catch (error){
        console.error(error);
        res.status(500).send("Error fetching history");
    }
};

const getAnalysisById = async (req, res) => {
    try{
        const {id} = req.params;
        const analysis = await Analysis.findById(id);

        if(!analysis){
            return res.status(400).json( {message : "Analysis not found"} );
        }

        res.json(analysis);
    }
    catch (error){
        console.error(error);
        res.status(500).send("Error fetching Analysis");
    }
};

const deleteAnalysis = async (req, res) => {
    try{
        const { id } = req.params;

        const deleted = await Analysis.findByIdAndDelete(id);

        if(!deleted){
            return res.status(400).json({message : "Analysis not found"});
        }

        res.json({message : "Analysis deleted successfully"});
    }
    catch(error){
        console.error(error);
        res.status(500).send("Error deleting analysis");
    }
};

const getTopAnalyses = async (req, res) => {
    try{
        const top = await Analysis.find().sort({score:-1}).limit(5);

        res.json(top);
    }
    catch(error){
        console.error(error);
        res.status(500).send("Error fetching top analyses");
    }
}

module.exports = {
    uploadFile,
    upload,
    getAnalysisHistory,
    getAnalysisById,
    deleteAnalysis,
    getTopAnalyses
};