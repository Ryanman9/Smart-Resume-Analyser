import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

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
        <div className="dashboard">

        <h1 className="dashboard-title">Dashboard</h1>

        <div className="stats">
            <div className="card">
            <h3>Total Analyses</h3>
            <h2>{total}</h2>
            </div>

            <div className="card">
            <h3>Best Score</h3>
            <h2>
                {topScores[0]?.score
                ? `${topScores[0].score}%`
                : "No Data"}
            </h2>
            </div>
        </div>

        <div className="actions">
            <button onClick={() => navigate("/upload")} className="btn">
            Upload Resume
            </button>

            <button onClick={() => navigate("/history")} className="btn secondary">
            History
            </button>
        </div>

        <h2 className="section-title">Top Scores</h2>

        {topScores.length === 0 && <p>No analyses yet</p>}

        <div className="top-list">
            {topScores.map((item, index) => (
            <div key={item._id} className="top-card">
                <h4 className="rank">{index + 1}</h4>
                <p className="score">Score: {item.score}%</p>
                <p className="company">{item.companyName}</p>

                <button
                className="btn small"
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
                >
                View Result
                </button>
            </div>
            ))}
        </div>

        </div>
        );
}

export default Dashboard;