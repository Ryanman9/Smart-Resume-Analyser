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

        let jobDescriptions = req.body.jobDescriptions;

        // if nothing sent
        if (!jobDescriptions) {
            return res.status(400).json({ message: "jobDescriptions required" });
        }

        // if string -> parse
        if (typeof jobDescriptions === "string") {
            jobDescriptions = JSON.parse(jobDescriptions);
        }

        // if single value -> convert to array
        if (!Array.isArray(jobDescriptions)) {
            jobDescriptions = [jobDescriptions];
        }

        const results = [];

        for (const item of jobDescriptions) {

            const jd =
                typeof item === "string"
                    ? item
                    : item.jd;

            const lines = jd.split("\n");

            const firstLine = lines[0];

            const company =
                typeof item === "string"
                    ? firstLine.split(" ")[0]
                    : item.company || firstLine.split(" ")[0];

            // remove only company word
            const cleanJD = jd.replace(company, "").trim();

            const analysis = analyzeResume(data.text, cleanJD);

            const savedAnalysis = await Analysis.create({
                resumeText: data.text,
                jobDescription: jd,
                companyName: company,
                matchedKeywords: analysis.matchedKeywords,
                missingKeywords: analysis.missingKeywords,
                matchedPhrases: analysis.matchedPhrases,
                missingPhrases: analysis.missingPhrases,
                score: analysis.score
            });

            results.push(savedAnalysis);
        }

        results.sort((a,b) => b.score - a.score);
        const rankedResults = results.map((items,index) => {
            let level = "Weak";

            if(items.score >= 80){
                level = "Strong";
            }
            else if(items.score >= 60){
                level = "Medium";
            }

            return {
                rank : index + 1,
                matchLevel : level,
                ...items._doc
            };
        });

        const bestMatch = rankedResults[0];
        
        const suggestions = [...new Set(
            rankedResults.flatMap(item => [
            ...(item.missingKeywords || []),
            ...(item.missingPhrases || [])
            ])
        )];

        let suggestionMessage = null;

        if (suggestions.length > 0) {
            suggestionMessage = "Improve your resume by adding these missing skills";
        }

        res.json({
            message:"File uploaded and analyzed successfully",
            count: rankedResults.length,
            bestMatch,
            suggestions,
            suggestionMessage,
            analysis: rankedResults
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