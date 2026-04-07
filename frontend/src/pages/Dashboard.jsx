import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    return(
        <div>
            <h1>Dashboard</h1>

            <button onClick={() => navigate("/upload")}>
                Upload Resume
            </button>

            <button onClick={() => navigate("/result?filter=top")}>
                Top Score
            </button>

            <button onClick={() => navigate("/history")}>
                History
            </button>
        </div>
    );
}

export default Dashboard;