import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./MosquitoGame.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GameNav from "./GameNav";

const MosquitoGame = () => {
  const apiURL = import.meta.env.VITE_API_URL;
  const mosquitoGameInstructions = `
Instructions for Mosquito Game!
- Mosquitoes will appear randomly on the screen.
- Click on them quickly to swat them before they disappear.
- Each swat earns you points — miss too many and it's game over!
- Speed and accuracy are the keys to victory!
`;

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const [lives, setLives] = useState(5);
  const [mosquitoVisible, setMosquitoVisible] = useState(false);
  const [position, setPosition] = useState({ top: 100, left: 100 });
  const [showSplash, setShowSplash] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const mosquitoTimer = useRef(null);
  const gameInterval = useRef(null);

  const MAX_LIVES = 5;

  const getRandomPosition = () => {
    const gameArea = document.querySelector(".gameArea");
    const gameAreaRect = gameArea.getBoundingClientRect();

    const top = Math.random() * (gameAreaRect.height - 100);
    const left = Math.random() * (gameAreaRect.width - 100);

    return { top, left };
  };

  useEffect(() => {
    startGame();
    return () => {
      clearInterval(gameInterval.current);
      clearTimeout(mosquitoTimer.current);
    };
  }, []);

  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const res = await axios.get(`${apiURL}/solomatches/highscore/7`);
        setHighScore(res.data.highScore);
      } catch (err) {
        console.error("Failed to fetch high score:", err);
      }
    };

    fetchHighScore();

    return () => {
      clearInterval(gameInterval.current);
      clearTimeout(mosquitoTimer.current);
    };
  }, []);

  useEffect(() => {
    if (lives <= 0 && !gameOver) {
      clearInterval(gameInterval.current);
      clearTimeout(mosquitoTimer.current);
      saveScore();
      setGameOver(true);
    }
  }, [lives, gameOver]);

  const startGame = () => {
    setScore(0);
    setLives(MAX_LIVES);
    setGameOver(false);
    setStartTime(new Date());

    gameInterval.current = setInterval(() => {
      const newPos = getRandomPosition();
      setPosition(newPos);
      setMosquitoVisible(true);

      mosquitoTimer.current = setTimeout(() => {
        setMosquitoVisible(false);
        setLives((prev) => prev - 1);
      }, 1200);
    }, 1500);
  };

  const handleClick = () => {
    if (gameOver) return;

    if (mosquitoVisible) {
      setScore((prev) => prev + 1);
      setMosquitoVisible(false);
      setShowSplash(true);
      clearTimeout(mosquitoTimer.current);

      setTimeout(() => setShowSplash(false), 200);
    }
  };

  const restartGame = () => {
    startGame();
  };

  const saveScore = async () => {
    try {
      const token = localStorage.getItem("token");
      const endTime = new Date();

      await axios.post(
        `${apiURL}/solomatches`,
        {
          gameId: 7,
          startTime,
          endTime,
          score,
          outcome: "score",
          metadata: {
            highScore,
            livesLost: MAX_LIVES,
            finalScore: score,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error saving mosquito match:", err);
    }
  };

  const healthPercentage = (lives / MAX_LIVES) * 100;

  return (
    <>
      <Navbar />
      <GameNav instructions={mosquitoGameInstructions} />
      <div
        className="gameArea"
        onClick={() => {
          if (!gameOver && !mosquitoVisible) {
            setLives((prev) => prev - 1);
          }
        }}
      >
        <div className="topBar">
          <span>Score: {score}</span>
          <span>High Score: {highScore}</span>
          <span>Lives: {lives}</span>
        </div>

        <div className="healthBarContainer">
          <div
            className="healthBarFill"
            style={{ width: `${healthPercentage}%` }}
          />
        </div>

        {mosquitoVisible && (
          <img
            src="/mosquitoImage.gif"
            alt="Mosquito"
            onClick={handleClick}
            className="mosquitoImg"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          />
        )}

        {showSplash && (
          <div
            className="splash"
            style={{
              top: `${position.top + 10}px`,
              left: `${position.left + 10}px`,
            }}
          />
        )}

        {gameOver && (
          <div className="mosquitoGameOver">
            <h2>Game Over</h2>
            <p>Final Score: {score}</p>
            <p>High Score: {highScore}</p>
            <button onClick={restartGame}>Restart</button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MosquitoGame;
