import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this
import "./HangmanGame.css";
import wordsList from "../assets/words.json";
import { hangmanStages } from "../utils/hangmanStages";
import Navbar from "./Navbar";
import axios from "axios";
import "./Universal.css";

const HangmanGame = () => {
  const [wordObj, setWordObj] = useState(null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [lives, setLives] = useState(6);
  const [gameStatus, setGameStatus] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  const [score, setScore] = useState(0);
  const [sessionActive, setSessionActive] = useState(true);
  const [startTime, setStartTime] = useState(new Date());

  const navigate = useNavigate(); // ✅ Add this

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    if (!sessionActive) return;

    const random = wordsList[Math.floor(Math.random() * wordsList.length)];
    setWordObj(random);
    setGuessedLetters([]);
    setWrongGuesses([]);
    setLives(6);
    setGameStatus("");
    setIsGameOver(false);
  };

  const handleGuess = (letter) => {
    if (
      !wordObj ||
      isGameOver ||
      guessedLetters.includes(letter) ||
      wrongGuesses.includes(letter)
    ) {
      return;
    }

    if (wordObj.word.includes(letter)) {
      const newGuessed = [...guessedLetters, letter];
      setGuessedLetters(newGuessed);

      if (wordObj.word.split("").every((char) => newGuessed.includes(char))) {
        setScore((prev) => prev + 1);
        setGameStatus("🎉 You Win!");
        setIsGameOver(true);
        setTimeout(() => startNewGame(), 1000);
      }
    } else {
      const newWrongGuesses = [...wrongGuesses, letter];
      setWrongGuesses(newWrongGuesses);
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setGameStatus(`💀 You Lost! Word was: ${wordObj.word}`);
        setIsGameOver(true);
        setTimeout(() => startNewGame(), 1500);
      }
    }
  };

  const endGameSession = async () => {
    setSessionActive(false);
    const token = localStorage.getItem("token");
    const endTime = new Date();
    const timeTakenSeconds = Math.round((endTime - startTime) / 1000);

    try {
      await axios.post(
        "http://localhost:3000/api/solomatches",
        {
          gameId: 4, // Hangman
          startTime,
          endTime,
          score,
          outcome: "scored",
          metadata: { timeTaken: `${timeTakenSeconds}s` },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/games");
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  const displayWord = () => {
    return wordObj?.word
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <>
      <Navbar />
      <div className="hangman-game">
        <h1>🕹️ Hangman</h1>
        {wordObj && <p className="hint">Hint: {wordObj.hint}</p>}

        <div
          style={{
            whiteSpace: "pre",
            fontFamily: "monospace",
            fontSize: "1rem",
            color: "#fff",
          }}
        >
          {hangmanStages[wrongGuesses.length]}
        </div>

        <div className="word-display">
          <p>{displayWord()}</p>
        </div>

        <div className="wrong-guesses">
          <p>Wrong guesses: {wrongGuesses.join(", ")}</p>
        </div>

        <div className="lives">
          <p>Lives left: {lives}</p>
        </div>

        <div className="score">
          <p>Score: {score}</p>
        </div>

        <div className="letters">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={
                guessedLetters.includes(letter) ||
                wrongGuesses.includes(letter) ||
                isGameOver
              }
            >
              {letter}
            </button>
          ))}
        </div>

        {gameStatus && <div className="game-status">{gameStatus}</div>}

        {sessionActive && (
          <button onClick={endGameSession} className="end-session-btn">
            End Game Session
          </button>
        )}
      </div>
    </>
  );
};

export default HangmanGame;
