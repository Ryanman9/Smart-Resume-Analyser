const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const analyzeResume = require("../services/analyzeService");

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

        res.json({
            message:"File uploaded and analyzed successfully",
            analysis: analysis
        });
    }
    catch(error){
        console.error(error);
        res.status(500).send("Error processing file");
    }
};

module.exports = {
    uploadFile,
    upload
};