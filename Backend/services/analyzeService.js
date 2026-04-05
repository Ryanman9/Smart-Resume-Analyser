const stopWords = [
    "for", "with", "and", "the", "a", "an",
    "looking", "developer", "skills", "experience",
    "in", "of", "to"
];

const skillPhrases = [
    "machine learning",
    "data structures",
    "web development",
    "artificial intelligence",
    "deep learning"
];

const analyzeResume = (resumeText, jobDescription) => {
    const resume = resumeText
                    .toLowerCase()
                    .replace(/[^a-z0-9\s]/g, " ")
                    .replace(/\s+/g, " ");

    const job = jobDescription
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, " ")
                .replace(/\s+/g, " ");

    let words = job.split(/\W+/);

    // remove stop words
    words = words.filter(word => 
        word.length > 2 && !stopWords.includes(word)
    );
    
    const uniqueWords = [...new Set(words)];

    let matchedPhrases = [];
    let relevantPhrases = [];   

    skillPhrases.forEach( skill => {
        if(job.includes(skill)){
            relevantPhrases.push(skill);

            if(resume.includes(skill)){
                matchedPhrases.push(skill);
            }
        }
    });

    let matched = [];
    let missing = [];

    uniqueWords.forEach(word => {
        if(resume.includes(word)){
            matched.push(word);
        }
        else{
            missing.push(word);
        }
    });

    const uniqueMatched = [...new Set(matched)];
    const uniqueMissing = [...new Set(missing)];

    const totalItems = uniqueWords.length + relevantPhrases.length;
    const totalMatched = uniqueMatched.length + matchedPhrases.length;

    const score = totalItems === 0 ? 0 : (totalMatched / totalItems) * 100;

    return{
        matchedKeywords: uniqueMatched,
        missingKeywords: uniqueMissing,
        matchedPhrases: matchedPhrases,
        score: score.toFixed(2)
    };
};

module.exports = analyzeResume;