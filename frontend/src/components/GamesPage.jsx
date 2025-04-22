// src/components/GamesPage.jsx
import React from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./GameCard.css";
import Footer from "./Footer";

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [offset, setOffset] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const { token } = useAuth();

  const limit = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames(0, false);
  }, []);

  const handlePlay = async (gameId, route) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `http://localhost:3000/api/games/${gameId}/play`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Pass token here
          },
        }
      );

      fetchGames(0, false); // refresh game data
      navigate(route); // go to the game
    } catch (err) {
      console.error("Error updating times played:", err);
    }
  };

  const fetchGames = async (newOffset, append = true) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/games?limit=${limit}&offset=${newOffset}`
      );

      console.log(res.data); // Add this line
      const { games: newGames, total } = res.data;
      setTotalGames(total);
      if (append) {
        setGames((prev) => {
          const combined = [...prev, ...newGames];
          const uniqueGames = Array.from(
            new Set(combined.map((a) => a.gameId))
          ).map((id) => combined.find((a) => a.gameId === id));
          return uniqueGames;
        });
        setOffset((prev) => prev + limit);
      } else {
        setGames(newGames);
        setOffset(limit);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      setHasMore(false);
    }
  };

  const handleShowMore = () => {
    if (games.length < totalGames) {
      fetchGames(offset);
    } else {
      setShowAll(true);
    }
  };

  const handleShowLess = () => {
    setShowAll(false);
    fetchGames(0, false);
  };

  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>All Games</h1>
        {games.length === 0 ? (
          <p style={{ fontSize: "20px", marginTop: "40px" }}>
            🎮 No Games Available
          </p>
        ) : (
          <>
            <div className="game-grid">
              {games.map((game) => (
                <div key={game.gameId} className="game-card">
                  <img src={game.gameImg} alt={game.gameName} />
                  <h3>{game.gameName || "No Name Available"}</h3>
                  <p>{game.gameDesc}</p>
                  <p>
                    <strong>Times Played:</strong> {game.timesPlayed}
                  </p>

                  <button
                    onClick={() => handlePlay(game.gameId, game.gameRoute)}
                  >
                    Play
                  </button>
                </div>
              ))}
            </div>
            {totalGames > limit && (
              <button
                onClick={showAll ? handleShowLess : handleShowMore}
                className="show-more-btn"
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default GamesPage;
