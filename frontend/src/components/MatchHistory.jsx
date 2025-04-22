import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MatchHistory.css";

const MatchHistory = () => {
  const [matches, setMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 10;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3000/api/solomatches/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMatches(res.data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    };

    fetchMatches();
  }, []);

  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);
  const totalPages = Math.ceil(matches.length / matchesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="match-history-container">
      {matches.length === 0 ? (
        <p>No matches yet.</p>
      ) : (
        <>
          <table className="match-history-table">
            <thead>
              <tr>
                <th>Game</th>
                <th>Score</th>
                <th>Outcome</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {currentMatches.map((match) => (
                <tr key={match.matchId}>
                  <td>{match.game?.gameName || "-"}</td>
                  <td>{match.score}</td>
                  <td>{match.outcome}</td>
                  <td>{new Date(match.startTime).toLocaleString()}</td>
                  <td>{new Date(match.endTime).toLocaleString()}</td>
                  <td>
                    Time: {match.metadata?.timeTaken || "-"} | Lives:{" "}
                    {match.metadata?.livesUsed ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              ⬅ Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MatchHistory;
