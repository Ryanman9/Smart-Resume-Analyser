import { useLocation } from "react-router-dom";

function Result() {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return <h2>No Results Found</h2>;
  }

  const results = data.analysis;

  return (
    <div>
      <h1>Analysis Result</h1>

      <h2>Best Match Score: {data.bestMatch?.score}%</h2>

      {data.suggestionMessage && (
        <>
          <h3>{data.suggestionMessage}</h3>
          <ul>
            {data.suggestions?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </>
      )}

      <hr />

      {results.map((item, index) => (
        <div key={index}>
          <h3>Job Description {index + 1}</h3>

          <p>Score: {item.score}%</p>
          <p>Match Level: {item.matchLevel}</p>
          <p>Rank: {item.rank}</p>

          <h4>Matched Keywords</h4>
          <ul>
            {item.matchedKeywords?.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>

          <h4>Missing Keywords</h4>
          <ul>
            {item.missingKeywords?.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>

          <h4>Matched Phrases</h4>
          <ul>
            {item.matchedPhrases?.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Result;