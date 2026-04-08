import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Upload() {
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const [resume, setResume] = useState(null);
    const [jobDescriptions, setJobDescriptions] = useState([""]);

    const handleJDChange = (index, value) => {
        const updated = [...jobDescriptions];
        updated[index] = value;

        setJobDescriptions(updated);
    };

    const addJobDescription = () => {
        setJobDescriptions([...jobDescriptions, ""]);
    };

    const handleAnalyze = async () => {
        console.log("Analyze clicked");

        if (!resume) {
            alert("Please upload resume");
            return;
        }

        const formData = new FormData();
        formData.append("resume", resume);

        formData.append("jobDescriptions", JSON.stringify(jobDescriptions));
        
        try{
            const response = await fetch(`${API}/api/upload`, {
                method : "POST",
                body : formData,
            });

            if(!response.ok){
                const text = await response.text();
                console.error("Server error: ", text)
                return;
            }

            const data = await response.json();

            navigate("/result", {state:data});
        }
        catch(error){
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Upload Resume</h1>

            <input type="file"
            onChange={(e) => setResume(e.target.files[0])}/>

            <h3>Job Descriptions</h3>

            {jobDescriptions.map((jd, index) => (
                <div key={index}>
                <textarea
                    placeholder={`Job Description ${index + 1}`}
                    value={jd}
                    onChange={(e) =>
                    handleJDChange(index, e.target.value)
                }
                />
                </div>
            ))}

            <button onClick={addJobDescription}> Add Another JD</button>

            <br /><br/>

            <button onClick={handleAnalyze}>
                Analyze
            </button>
        </div>
    );
}

export default Upload;