// components/MatchHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const MatchHistory = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3000/api/solomatches/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMatches(res.data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>Your Match History</h3>
      {matches.length === 0 ? (
        <p>No matches yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#1e1e1e",
            color: "#fff",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Game</th>
              <th style={thStyle}>Score</th>
              <th style={thStyle}>Outcome</th>
              <th style={thStyle}>Start Time</th>
              <th style={thStyle}>End Time</th>
              <th style={thStyle}>Details</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.matchId} style={{ textAlign: "center" }}>
                <td style={tdStyle}>{match.game.gameName}</td>
                <td style={tdStyle}>{match.score}</td>
                <td style={tdStyle}>{match.outcome}</td>
                <td style={tdStyle}>
                  {new Date(match.startTime).toLocaleString()}
                </td>
                <td style={tdStyle}>
                  {new Date(match.endTime).toLocaleString()}
                </td>
                <td style={tdStyle}>
                  Time: {match.metadata?.timeTaken || "-"} | Lives:{" "}
                  {match.metadata?.livesUsed ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  padding: "10px",
  borderBottom: "1px solid #444",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #333",
};

export default MatchHistory;
