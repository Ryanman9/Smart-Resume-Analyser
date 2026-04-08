import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Upload.css";

function Upload() {
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const [resume, setResume] = useState(null);
    const [fileName, setFileName] = useState("No file selected");

    const [jobDescriptions, setJobDescriptions] = useState([
        { company: "", jd: "" }
    ]);

    const handleJDChange = (index, field, value) => {
        const updated = [...jobDescriptions];
        updated[index][field] = value;
        setJobDescriptions(updated);
    };

    const addJobDescription = () => {
        setJobDescriptions([
            ...jobDescriptions,
            { company: "", jd: "" }
        ]);
    };

    const handleAnalyze = async () => {
        if (!resume) {
            alert("Please upload resume");
            return;
        }

        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("jobDescriptions", JSON.stringify(jobDescriptions));

        try {
            const response = await fetch(`${API}/api/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            navigate("/result", { state: data });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="upload-page">
            <h1 className="upload-title">Upload Resume</h1>

            <div className="upload-card">

                {/* File Upload */}
                <div className="file-upload">
                    <label className="file-label">
                        Choose Resume
                        <input
                            type="file"
                            className="file-hidden"
                            onChange={(e) => {
                                setResume(e.target.files[0]);
                                setFileName(
                                    e.target.files[0]?.name || "No file selected"
                                );
                            }}
                        />
                    </label>

                    <span className="file-name">{fileName}</span>
                </div>

                <h3 className="jd-title">Job Descriptions</h3>

                {jobDescriptions.map((item, index) => (
                    <div key={index} className="jd-block">

                        <input
                            className="company-input"
                            type="text"
                            placeholder="Company Name"
                            value={item.company}
                            onChange={(e) =>
                                handleJDChange(index, "company", e.target.value)
                            }
                        />

                        <textarea
                            className="jd-textarea"
                            placeholder={`Job Description ${index + 1}`}
                            value={item.jd}
                            onChange={(e) =>
                                handleJDChange(index, "jd", e.target.value)
                            }
                        />

                    </div>
                ))}

                <div className="upload-actions">
                    <button
                        className="btn secondary"
                        onClick={addJobDescription}
                    >
                        Add Another JD
                    </button>

                    <button
                        className="btn"
                        onClick={handleAnalyze}
                    >
                        Analyze
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Upload;