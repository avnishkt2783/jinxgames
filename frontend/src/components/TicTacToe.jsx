import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TicTacToe.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GameNav from "./GameNav";

const TicTacToe = () => {
  const apiURL = import.meta.env.VITE_API_URL;
  const ticTacToeInstructions = `
Instructions for Tic Tac Toe!
- Take turns placing Xs and Os on the 3x3 grid.
- First player to align 3 symbols in a row, column, or diagonal wins.
- If all cells are filled without a winner, the game is a draw.
- Play smart and block your opponent!
`;

  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isGameActive, setIsGameActive] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Player X's turn");
  const [winningCombo, setWinningCombo] = useState(null);
  const [startTime, setStartTime] = useState(new Date());

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const handleCellClick = (index) => {
    if (board[index] !== "" || !isGameActive) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winCombo = checkWin(newBoard);
    if (winCombo) {
      setWinningCombo(winCombo);
      setStatusMessage(`Player ${currentPlayer} wins! 🎉`);
      setIsGameActive(false);
      recordMatch(currentPlayer, newBoard, "win");
    } else if (!newBoard.includes("")) {
      setStatusMessage("It's a Draw!");
      setIsGameActive(false);
      recordMatch(null, newBoard, "draw");
    } else {
      const nextPlayer = currentPlayer === "X" ? "O" : "X";
      setCurrentPlayer(nextPlayer);
      setStatusMessage(`Player ${nextPlayer}'s turn`);
    }
  };

  const checkWin = (newBoard) => {
    return winningCombinations.find((combo) =>
      combo.every((index) => newBoard[index] === currentPlayer)
    );
  };

  const recordMatch = async (winner, finalBoard, outcome) => {
    try {
      const endTime = new Date();
      const token = localStorage.getItem("token");
      const scoreOutcome = outcome;
      if (winner) outcome = `${winner} ${outcome}`;

      await axios.post(
        `${apiURL}/solomatches`,
        {
          gameId: 6,
          startTime,
          endTime,
          score: scoreOutcome === "win" ? 1 : 0,
          outcome,
          metadata: {
            winner,
            finalBoard,
            timeTaken: `${Math.round((endTime - startTime) / 1000)}s`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to save Tic Tac Toe match:", error);
    }
  };

  const restartGame = () => {
    setBoard(Array(9).fill(""));
    setIsGameActive(true);
    setCurrentPlayer("X");
    setStatusMessage("Player X's turn");
    setWinningCombo(null);
    setStartTime(new Date());
  };

  return (
    <>
      <Navbar />
      <GameNav instructions={ticTacToeInstructions} />
      <div className="tic-tac-toe">
        <h1 className="title">Tic Tac Toe</h1>
        <div className="board">
          {board.map((cell, index) => (
            <div
              key={index}
              className="cell"
              onClick={() => handleCellClick(index)}
            >
              {cell}
            </div>
          ))}
          {winningCombo && (
            <div
              className={`win-line win-line-${winningCombinations.findIndex(
                (c) => JSON.stringify(c) === JSON.stringify(winningCombo)
              )}`}
            ></div>
          )}
        </div>
        <div className="status">{statusMessage}</div>
        <button className="restart-button" onClick={restartGame}>
          Restart Game
        </button>
      </div>
      <Footer />
    </>
  );
};

export default TicTacToe;
