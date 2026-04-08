import { useState, useEffect } from "react";

function History() {
  const API = import.meta.env.VITE_API_UR
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try{
      const res = await fetch(`${API}/api/analysis`);
      const data = await res.json();

      setHistory(data);
    }
    catch(error){
      console.error("Error fetching history", error);
    }
  };

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
  }, []);

  return (
    <div>
      <h1>Analysis History</h1>

      {history.length === 0 ? (
        <p>No History Found</p>
      ) : (
        history.map((item) => (
          <div key={item._id} style={{border:"1px solid gray", margin:"10px", padding:"10px"}}>
            <p><b>Score:</b> {item.score}%</p>

            <p>
              <b>Job Description:</b>{" "}
              {item.jobDescription.substring(0, 120)}...
            </p>

            <p>
              <b>Date:</b>{" "}
              {new Date(item.createdAt).toLocaleString()}
            </p>

            <button onClick={() => deleteItem(item._id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default History;