const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
    resumeText: {
        type : String,
        required : true 
    },

    jobDescription : {
        type : String,
        required : true
    },

    companyName : {
        type: String,
        default: "Unknown"
    },

    matchedKeywords: [String],
    missingKeywords: [String],
    matchedPhrases: [String],
    missingPhrases: [String],
    score: Number,
    }, {
        timestamps : true
});

module.exports = mongoose.model("Analysis", analysisSchema);