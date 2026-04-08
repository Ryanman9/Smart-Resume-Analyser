// Declaring some stop words
const stopWords = [
    "for", "with", "and", "the", "a", "an",
    "looking", "developer", "skills", "experience",
    "in", "of", "to"
];

// Declaring some skill phrases
const skillPhrases = [
    "machine learning",
    "data structures",
    "web development",
    "artificial intelligence",
    "deep learning"
];

// Declaring the weights
const weights = {
    keywords : 2,
    phrase : 6,
    missingPenalty : -2
};

// Making a clean text function
const cleanText = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

// Analyze Resume Function starts here
const analyzeResume = (resumeText, jobDescription) => {

    // Extract text from the resume and job description
    const resume = cleanText(resumeText)
    const job = cleanText(jobDescription)

    // Extracting words from the job description
    let words = job.split(/\W+/);

    // remove stop words + small words
    words = words.filter(word => 
        word.length > 2 && !stopWords.includes(word)
    );
    
    // creating an array of unique words from the job description
    const uniqueWords = [...new Set(words)];

    // convert resume to word set 
    const resumeWords = new Set(resume.split(/\W+/));

    // phrase matching
    let matchedPhrases = [];
    let relevantPhrases = [];
    let missingPhrases = [];

    // traverse through skill phrases and for each skill...
    skillPhrases.forEach( skill => {
        // if skill phrase matches to job description then we push it to the relevant phrase array
        if(job.includes(skill)){
            relevantPhrases.push(skill);

            // if skill phrase matches to resume then we push it to the matched phrase array
            if(resume.includes(skill)){
                matchedPhrases.push(skill);
            }
            else {
            missingPhrases.push(skill);
            }
        }
    });

    // keywords matching
    let matchedKeywords = [];
    let missingKeywords = [];

    uniqueWords.forEach(word => {
        if(resume.includes(word)){
            matchedKeywords.push(word);
        }
        else{
            missingKeywords.push(word);
        }
    });

    // creating unique words of matched and missing keywords
    matchedKeywords = [...new Set(matchedKeywords)];
    missingKeywords = [...new Set(missingKeywords)];

    let score = 0;

    // traverse through unique words (job description) 
    uniqueWords.forEach( word => {
        // if resume got that word we increase the score accordingly
        if(resumeWords.has(word)){
            score += weights.keywords;
        }
        // else if the word is missing then we decrease the score accordingly
        else {
            score += weights.missingPenalty;
        }
    });

    // same we traverse through relevantPhrases and for each phrase if resume got that phrase then we increase the score accordingly
    relevantPhrases.forEach( phrase => {
        if(resume.includes(phrase)){
            score += weights.phrase;
        }
    });

    // calculate the total score here
    const maxScore = 
        (uniqueWords.length * weights.keywords) + (relevantPhrases.length * weights.phrase);

    score = Math.max(score, 0);

    const finalScore = maxScore === 0 ? 0 : (score/maxScore) * 100;

    // print the result
    return{
        matchedKeywords,
        missingKeywords,
        matchedPhrases,
        missingPhrases,
        score: finalScore.toFixed(2)
    };
};

module.exports = analyzeResume;