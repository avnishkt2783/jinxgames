import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SnakeGame.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GameNav from "./GameNav";

const gridSize = 20;
const initialSnake = [[0, 0]];
const getRandomFood = () => [
  Math.floor(Math.random() * gridSize),
  Math.floor(Math.random() * gridSize),
];

export default function SnakeGame() {
  const apiURL = import.meta.env.VITE_API_URL;
  const snakeInstructions = `
Instructions for Snake Game!
- Use arrow keys to control the snake's movement.
- Eat the food to grow longer and increase your score.
- Avoid colliding with the walls or your own tail.
- How long can you survive?
`;

  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(getRandomFood);
  const [direction, setDirection] = useState([0, 1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [startTime, setStartTime] = useState(new Date());

  useEffect(() => {
    const handleKey = (e) => {
      const keyMap = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
      };

      if (keyMap[e.key]) {
        e.preventDefault();
        setDirection(keyMap[e.key]);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, 100);

    return () => clearInterval(interval);
  }, [snake, direction, gameOver]);

  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const res = await axios.get(`${apiURL}/solomatches/highscore/8`);
        setHighScore(res.data.highScore);
      } catch (err) {
        console.error("Failed to fetch high score:", err);
      }
    };

    fetchHighScore();
  }, []);

  const moveSnake = () => {
    const newHead = [snake[0][0] + direction[0], snake[0][1] + direction[1]];

    if (
      newHead[0] < 0 ||
      newHead[1] < 0 ||
      newHead[0] >= gridSize ||
      newHead[1] >= gridSize ||
      snake.some((seg) => seg[0] === newHead[0] && seg[1] === newHead[1])
    ) {
      setGameOver(true);
      saveScore();
      return;
    }

    const newSnake = [newHead, ...snake];

    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setFood(getRandomFood());
      setScore((prev) => prev + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const resetGame = () => {
    setSnake(initialSnake);
    setFood(getRandomFood());
    setDirection([0, 1]);
    setGameOver(false);
    setScore(0);
    setStartTime(new Date());
  };

  const saveScore = async () => {
    try {
      const token = localStorage.getItem("token");
      const endTime = new Date();

      await axios.post(
        `${apiURL}/solomatches`,
        {
          gameId: 8,
          startTime,
          endTime,
          score,
          outcome: "score",
          metadata: {
            length: snake.length,
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
      console.error("Error saving snake match:", err);
    }
  };

  return (
    <>
      <Navbar />
      <GameNav instructions={snakeInstructions} />
      <div className="snake-game-wrapper">
        <div className="game-container">
          <h1>🐍 Snake Game</h1>
          <h2>High Score: {highScore}</h2>
          <h2>Score: {score}</h2>
          <div className="grid-container">
            <div className="grid">
              {[...Array(gridSize)].map((_, row) =>
                [...Array(gridSize)].map((_, col) => {
                  const isSnake = snake.some(
                    ([x, y]) => x === row && y === col
                  );
                  const isFood = food[0] === row && food[1] === col;
                  return (
                    <div
                      key={`${row}-${col}`}
                      className={`cell ${isSnake ? "snake" : ""} ${
                        isFood ? "food" : ""
                      }`}
                    />
                  );
                })
              )}
            </div>
            {gameOver && (
              <div className="game-over-overlay">
                <h3>Game Over</h3>
                <button onClick={resetGame}>Restart</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
