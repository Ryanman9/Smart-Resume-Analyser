import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const [topScores, setTopScores] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const [topRes, historyRes] = await Promise.all([
                fetch(`${API}/api/analysis/top`),
                fetch(`${API}/api/analysis`)
            ]);

            const topData = await topRes.json();
            const historyData = await historyRes.json();

            setTopScores(topData);
            setTotal(historyData.length);
        } catch (error) {
            console.error("Dashboard error", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <h2>Loading Dashboard...</h2>;

    return (
        <div>
            <h1>Dashboard</h1>

            <div>
                <h3>Total Analyses: {total}</h3>
                <h3>
                    Best Score: {topScores[0]?.score
                        ? `${topScores[0].score}%`
                        : "No Data"}
                </h3>
            </div>

            <hr />

            <button onClick={() => navigate("/upload")}>
                Upload Resume
            </button>

            <button onClick={() => navigate("/history")}>
                History
            </button>

            <hr />

            <h2>Top Scores</h2>

            {topScores.length === 0 && <p>No analyses yet</p>}

            {topScores.map((item, index) => (
            <div
                key={item._id}
                onClick={() =>
                    navigate("/result", {
                        state: {
                            bestMatch: item,
                            suggestions: [
                                ...(item.missingKeywords || []),
                                ...(item.missingPhrases || [])
                            ],
                            suggestionMessage:
                                "Improve your resume by adding these missing skills",
                            analysis: [
                                {
                                    ...item,
                                    rank: 1,
                                    matchLevel:
                                        item.score >= 80
                                            ? "Strong"
                                            : item.score >= 60
                                            ? "Medium"
                                            : "Weak"
                                }
                            ]
                        }
                    })
                }
                style={{
                    border: "1px solid gray",
                    padding: "10px",
                    marginBottom: "10px",
                    cursor: "pointer"
                }}
            >
                <h4>Rank #{index + 1}</h4>
                <p>Score: {item.score}%</p>
                <p>
                    JD: {item.jobDescription.substring(0, 80)}...
                </p>
                <button>Click to view full result</button>
            </div>
        ))}
        </div>
    );
}

export default Dashboard;