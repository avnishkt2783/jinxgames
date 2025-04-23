import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./Universal.css";
import "./MemoryGame.css";
import Footer from "./Footer";
import GameNav from "./GameNav";

const MemoryGame = () => {
  const apiURL = import.meta.env.VITE_API_URL;
  const memoryInstructions = `
  Instructions for Memory Game!
  - You will be shown a Number Pattern in each round.
  - In each subsequent rounds pattern length increases by 1.
  - Try to type the correct pattern to keep going.
  - Lets see who scores highest (Score = Rounds Passed)!
`;

  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [round, setRound] = useState(1);
  const [showSequence, setShowSequence] = useState(true);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const res = await axios.get(`${apiURL}/solomatches/highscore/1`);
        setHighScore(res.data.highScore);
      } catch (err) {
        console.error("Failed to fetch high score:", err);
      }
    };

    fetchHighScore();
  }, []);

  useEffect(() => {
    if (!gameOver) {
      generateSequence(round);
      if (round === 1) {
        setStartTime(new Date());
      }
    }
  }, [round]);

  const generateSequence = (length) => {
    const newSeq = Array.from(
      { length },
      () => Math.floor(Math.random() * 9) + 1
    );
    setSequence(newSeq);
    setShowSequence(true);
    setTimeout(() => setShowSequence(false), 2000 + length * 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputArray = userInput.split("").map(Number);
    if (JSON.stringify(inputArray) === JSON.stringify(sequence)) {
      setMessage("✅");
      setTimeout(() => {
        setRound((prev) => prev + 1);
        setUserInput("");
        setMessage("");
      }, 1000);
    } else {
      setMessage("GAME OVER");
      setGameOver(true);
      await saveScore(round - 1);
    }
  };

  const saveScore = async (finalScore) => {
    try {
      const token = localStorage.getItem("token");
      const endTime = new Date();
      const response = await axios.post(
        `${apiURL}/solomatches`,
        {
          gameId: 1,
          startTime,
          endTime,
          score: finalScore,
          outcome: "score",
          metadata: {
            timeTaken: `${Math.round((endTime - startTime) / 1000)}s`,
            roundsCleared: finalScore,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Match recorded:", response.data);
    } catch (error) {
      console.error("Error saving match:", error);
    }
  };

  const restartGame = () => {
    setRound(1);
    setUserInput("");
    setMessage("");
    setGameOver(false);
    setStartTime(new Date());
    generateSequence(1);
  };

  const inputRef = useRef(null);
  useEffect(() => {
    if (!showSequence && !gameOver && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSequence, gameOver]);

  return (
    <>
      <Navbar />
      <GameNav instructions={memoryInstructions} />
      <div
        style={{
          backdropFilter: "blur(10px)",
          padding: "10px",
          margin: "10px auto",
          width: "80%",
          height: "80%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "1.5rem",
        }}
      >
        <h2 id="memory-gameTitle">🧠 Memory Game</h2>
        <p id="subMessage">Game has started, Remember the sequence below.</p>
        <p id="high-score">High Score: {highScore}</p>
        <p id="roundStatus">Round: {round}</p>
        {showSequence ? (
          <h3 className="sequence-display">{sequence.join(" ")}</h3>
        ) : !gameOver ? (
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter sequence"
              className="input-box"
              id="inputMemory"
            />
          </form>
        ) : null}
        <p id="game-message">{message}</p>
        {gameOver && (
          <>
            <button onClick={restartGame} className="restart-button">
              Restart
            </button>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MemoryGame;
