import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/History.css";

function History() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try{
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const res = await fetch(`${API}/api/analysis`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      const data = await res.json();

      console.log("history:", data);
      setHistory(data);
    }
    catch(error){
      console.error("Error fetching history", error);
    }
    finally{
      setLoading(false);
    }
  }, [API, navigate]);

  const deleteItem = async (id) => {
    try{
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      await fetch(`${API}/api/analysis/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchHistory();
    }
    catch(error){
      console.error("Delete Failed", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading) return <h2>Loading history...</h2>;

  return (
    <div className="history">
      <h1 className="history-title">Analysis History</h1>

      {history.length === 0 ? (
        <p>No History Found</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item._id} className="history-card">

              <div className="history-top">
                <span className="history-score">
                  {item.score}%
                </span>

                <button
                  className="history-delete"
                  onClick={() => deleteItem(item._id)}
                >
                  Delete
                </button>
              </div>

              <p className="history-jd">
                {item.jobDescription.substring(0, 120)}...
              </p>

              <p className="history-date">
                {new Date(item.createdAt).toLocaleString()}
              </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;