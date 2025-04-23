import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { useAuth } from "../AuthContext";
import "./GameCard.css";

const GamesPage = () => {
  const apiURL = import.meta.env.VITE_API_URL;
  const [games, setGames] = useState([]);
  const [offset, setOffset] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const limit = 3;

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
        `${apiURL}/games/${gameId}/play`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchGames(0, false);
      navigate(route);
    } catch (err) {
      console.error("Error updating times played:", err);
    }
  };

  const fetchGames = async (newOffset, append = true) => {
    try {
      const res = await axios.get(
        `${apiURL}/games?limit=${limit}&offset=${newOffset}`
      );
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
      <div className="games-container">
        <h1>All Games</h1>
        {games.length === 0 ? (
          <p className="no-games-text">🎮 No Games Available</p>
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
