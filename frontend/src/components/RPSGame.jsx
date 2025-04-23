import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./RPSGame.css";
import "./Universal.css";
import Footer from "./Footer";
import GameNav from "./GameNav";

const choices = ["rock", "paper", "scissors"];
const choiceEmojis = {
  rock: "✊",
  paper: "🖐",
  scissors: "✌",
};

const RPSGame = () => {
  const apiURL = import.meta.env.VITE_API_URL;

  const rpsInstructions = `
    Instructions for Rock Paper Scissors!
    - Choose Rock, Paper, or Scissors.
    - Rock beats Scissors, Scissors beats Paper, Paper beats Rock.
    - You are playing against Computer, it choses automatically!
  `;

  const [userChoice, setUserChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");
  const [result, setResult] = useState("");

  const getResult = (user, comp) => {
    if (user === comp) return "draw";
    if (
      (user === "rock" && comp === "scissors") ||
      (user === "paper" && comp === "rock") ||
      (user === "scissors" && comp === "paper")
    )
      return "win";
    return "lose";
  };

  const playGame = async (choice) => {
    const comp = choices[Math.floor(Math.random() * choices.length)];
    const outcome = getResult(choice, comp);

    setUserChoice(choice);
    setComputerChoice(comp);
    setResult(outcome);

    await recordMatch(choice, comp, outcome);
  };

  const recordMatch = async (user, comp, outcome) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${apiURL}/solomatches`,
        {
          gameId: 2,
          startTime: new Date(),
          endTime: new Date(),
          score: outcome === "win" ? 1 : 0,
          outcome,
          metadata: {
            userChoice: user,
            computerChoice: comp,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Match recorded:", response.data);
    } catch (err) {
      console.error("Error recording match:", err);
    }
  };

  return (
    <>
      <Navbar />
      <GameNav instructions={rpsInstructions} />
      <div className="rps-container">
        <h2 className="rps-title">Rock Paper Scissors</h2>
        <p>Choose Your Sign.</p>
        <div className="rps-buttons">
          {choices.map((c) => (
            <button
              key={c}
              className="rps-choice-btn"
              onClick={() => playGame(c)}
            >
              {choiceEmojis[c]}
            </button>
          ))}
        </div>
        {userChoice && (
          <div className="rps-results">
            <div className="rps-choice-row">
              <div className="rps-info">
                You
                <div className="rps-choice-icon">
                  {choiceEmojis[userChoice]}
                </div>
              </div>
              <div className="rps-info">
                Computer
                <div className="rps-choice-icon">
                  {choiceEmojis[computerChoice]}
                </div>
              </div>
            </div>

            <h3 className="rps-result">{result.toUpperCase()}</h3>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RPSGame;
