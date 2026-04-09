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
            <div className="dashboard-header">
            <h1 className="dashboard-title">Dashboard</h1>

            <div className="header-actions">
                <button onClick={() => navigate("/upload")} className="btn">
                Upload Resume
                </button>

                <button
                onClick={() => navigate("/history")}
                className="btn secondary"
                >
                History
                </button>
            </div>
            </div>

            {/* stats */}
            <div className="stats-row">
            <div className="card stat">
                <h3>Total Analyses</h3>
                <h2>{total}</h2>
            </div>

            <div className="card stat">
                <h3>Best Score</h3>
                <h2>
                {topScores[0]?.score
                    ? `${topScores[0].score}%`
                    : "No Data"}
                </h2>
            </div>

            <div className="card stat">
                <h3>Total Companies</h3>
                <h2>{topScores.length}</h2>
            </div>
            </div>

            {/* top scores */}
            <div className="card table-card">
            <div className="table-header">
                <h2>Top Scores</h2>
            </div>

            {topScores.length === 0 && (
                <p className="empty">No analyses yet</p>
            )}

            <div className="table">
                {topScores.map((item, index) => (
                <div key={item._id} className="table-row">
                    <div className="col rank">
                    #{index + 1}
                    </div>

                    <div className="col company">
                    {item.companyName}
                    </div>

                    <div className="col score">
                    {item.score}%
                    </div>

                    <div className="col action">
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
                        View
                    </button>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
        );
}

export default Dashboard;