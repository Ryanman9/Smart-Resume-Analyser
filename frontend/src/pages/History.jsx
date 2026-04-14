import { useState, useEffect } from "react";
import { useCallback} from "react";
import "../styles/History.css";

function History() {
  const API = import.meta.env.VITE_API_URL;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try{
      const res = await fetch(`${API}/api/analysis`);
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
  }, [API]);

  const deleteItem = async (id) => {
    try{
      await fetch(`${API}/api/analysis/${id}`, {
        method: "DELETE",
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