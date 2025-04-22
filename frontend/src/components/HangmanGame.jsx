import React, { useState, useEffect } from "react";
import "./HangmanGame.css";
import wordsList from "../assets/words.json";
import { hangmanStages } from "../utils/hangmanStages";

const HangmanGame = () => {
  const [wordObj, setWordObj] = useState(null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [lives, setLives] = useState(6);
  const [gameStatus, setGameStatus] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
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
        setGameStatus("🎉 You Win!");
        setIsGameOver(true);
      }
    } else {
      const newWrongGuesses = [...wrongGuesses, letter];
      setWrongGuesses(newWrongGuesses);
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setGameStatus(`💀 You Lost! Word was: ${wordObj.word}`);
        setIsGameOver(true);
      }
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
    <div className="hangman-game">
      <h1>🕹️ Guess the Word (Hangman)</h1>
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

      <button onClick={startNewGame} className="restart-btn">
        🔁 Restart
      </button>
    </div>
  );
};

export default HangmanGame;
