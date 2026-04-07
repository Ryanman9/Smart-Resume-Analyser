import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Upload() {
    const navigate = useNavigate();

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
        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("jobDescriptions", JSON.stringify(jobDescriptions));

        const response = await fetch("http://localhost:5000/analyze", {
            method : "POST",
            body : formData,
        });

        const data = await response.json();

        navigate("/result", {state:data});
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