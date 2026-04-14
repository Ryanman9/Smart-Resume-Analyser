import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import "../styles/Result.css";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const query = new URLSearchParams(location.search);
  const isTop = query.get("filter") === "top";

  const [topResults, setTopResults] = useState([]);

  const data = location.state;

  const fetchTop = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const res = await fetch(`${API}/api/analysis/top`, {
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
      setTopResults(data);
    } catch (err) {
      console.error(err);
    }
    }, [API, navigate]);

    useEffect(() => {
      if (isTop) {
        fetchTop();
      }
    }, [isTop, fetchTop]);

  /* ================= TOP MODE ================= */

  if (isTop) {
    return (
      <div className="result-page">
        <h1 className="result-title">Top Resume Matches</h1>

        {topResults.map((item, index) => (
          <div className="top-card" key={item._id}>
            <h3 className="rank">Rank #{index + 1}</h3>

            <p className="score">Score: {item.score}%</p>

            <p>
              {item.jobDescription.substring(0, 150)}...
            </p>
          </div>
        ))}
      </div>
    );
  }

  /* ================= NO DATA ================= */

  if (!data) {
    return (
      <div className="result-page">
        <h2>No Results Found</h2>
      </div>
    );
  }

  const results = data?.analysis || [];

  /* ================= NORMAL MODE ================= */

  return (
    <div className="result-page">
      <h1 className="result-title">Analysis Result</h1>

      {/* Best Score */}
      <div className="best-score">
        Best Match Score: <span>{data.bestMatch?.score}%</span>
      </div>

      {/* Suggestions */}
      {data.suggestionMessage && (
        <div className="result-improve">
          <div className="result-improve-title">
            Improve your resume by adding:
          </div>

          <div className="result-improve-list">
            {data.suggestions?.map((s, i) => (
              <span key={i} className="result-improve-tag">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results.map((item, index) => (
        <div className="result-card" key={index}>
          <h3>{item.companyName}</h3>

          <div className="result-meta">
            <span className="score">Score: {item.score}%</span>
            <span className="match">Match: {item.matchLevel}</span>
            <span className="rank">Rank: {item.rank}</span>
          </div>

          {/* Matched Keywords */}
          <div className="keyword-block">
            <h4>Matched Keywords</h4>
            <div className="keyword-list">
              {item.matchedKeywords?.map((k, i) => (
                <span className="keyword" key={i}>
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="keyword-block">
            <h4>Missing Keywords</h4>
            <div className="keyword-list">
              {item.missingKeywords?.map((k, i) => (
                <span className="keyword missing" key={i}>
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Matched Phrases */}
          <div className="keyword-block">
            <h4>Matched Phrases</h4>
            <div className="keyword-list">
              {item.matchedPhrases?.map((p, i) => (
                <span className="keyword" key={i}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Result;