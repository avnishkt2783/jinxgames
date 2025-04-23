import { useAuth } from "../AuthContext";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./FlappyBirdGame.css";
import GameNav from "./GameNav";

const gameId = 3;

const FlappyBirdGame = () => {
  const apiURL = import.meta.env.VITE_API_URL;
  const flappyInstructions = `
  Instructions for Flappy Bird!
  - Press the spacebar to make bird fly.
  - Avoid hitting the pipes and try to go as far as you can.
  - The game ends if the bird crashes or falls.
  - Good luck!
`;

  const [birdY, setBirdY] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [pipeSpeed, setPipeSpeed] = useState(0.5);
  const [startTime, setStartTime] = useState(null);

  const birdHeight = 5;
  const birdWidth = 2;
  const pipeWidth = 5;
  const pipeGap = 40;
  const gravity = 0.2;
  const jumpStrength = -2.5;

  const gameArea = useRef(null);
  const hasEndedRef = useRef(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const res = await axios.get(
          `${apiURL}/solomatches/highscore/${gameId}`
        );
        setHighScore(res.data.highScore);
      } catch (err) {
        console.error("Failed to fetch high score:", err);
      }
    };

    fetchHighScore();
  }, []);

  const handleSpacebar = (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      if (!gameStarted) {
        startGame();
      } else if (!gameOver) {
        setBirdVelocity(jumpStrength);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleSpacebar, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleSpacebar);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const animationId = requestAnimationFrame(updateGame);
      return () => cancelAnimationFrame(animationId);
    }
  }, [birdY, pipes, gameOver, gameStarted, pipeSpeed]);

  const startGame = () => {
    setBirdY(30);
    setBirdVelocity(0);
    setPipes(generatePipes());
    setScore(0);
    setPipeSpeed(0.5);
    setGameOver(false);
    setStartTime(new Date());
    setGameStarted(true);
    hasEndedRef.current = false;
  };

  const endGame = async () => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    setGameOver(true);
    setGameStarted(false);

    const newHighScore = Math.max(score, highScore);
    setHighScore(newHighScore);

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("User not logged in, not recording match.");
      return;
    }

    const endTime = new Date();
    const timeTakenSeconds = Math.round((endTime - startTime) / 1000);

    try {
      await axios.post(
        `${apiURL}/solomatches`,
        {
          gameId,
          startTime,
          endTime,
          score,
          outcome: "score",
          metadata: {
            pipeSpeed,
            timeTaken: `${timeTakenSeconds}s`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error recording Flappy Bird match:", error);
    }
  };

  const updateGame = () => {
    setBirdY((prevY) => prevY + birdVelocity);
    setBirdVelocity((prev) => prev + gravity);

    if (birdY + birdHeight > 100 || birdY < 0) {
      endGame();
      return;
    }

    setPipes((prevPipes) => {
      let scored = false;
      const newPipes = prevPipes.map((pipe) => {
        const movedPipe = { ...pipe, x: pipe.x - pipeSpeed };
        if (!pipe.passed && movedPipe.x + pipeWidth < 5) {
          pipe.passed = true;
          scored = true;
        }
        return movedPipe;
      });

      if (newPipes[0].x + pipeWidth < 0) {
        newPipes.shift();
        newPipes.push(generateNewPipe());
      }

      if (scored) setScore((prev) => prev + 1);

      newPipes.forEach((pipe) => {
        if (
          pipe.x < 5 + birdWidth &&
          pipe.x + pipeWidth > 5 &&
          (birdY < pipe.y || birdY + birdHeight > pipe.y + pipeGap)
        ) {
          endGame();
        }
      });

      return newPipes;
    });
  };

  const generatePipes = () => {
    return Array.from({ length: 3 }, (_, i) => generateNewPipe(i));
  };

  const generateNewPipe = (i = 0) => {
    const pipeHeight = Math.random() * 40 + 10;
    return {
      x: 100 + i * 30,
      y: pipeHeight,
      passed: false,
    };
  };

  return (
    <>
      <Navbar />
      <GameNav instructions={flappyInstructions} />
      <div
        className="flappy-bird-game"
        ref={gameArea}
        style={{
          margin: "5px auto",
          position: "relative",
          width: "80%",
          height: "80%",
          overflow: "hidden",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "1.5rem",
        }}
      >
        <img
          src="/flappybirdIcon.gif"
          alt="Flappy Bird"
          style={{
            position: "absolute",
            top: `${birdY}%`,
            left: "5%",
            width: "100px",
            height: "100px",
            objectFit: "contain",
          }}
        />
        {pipes.map((pipe, index) => (
          <React.Fragment key={index}>
            <div
              style={{
                position: "absolute",
                top: "0%",
                left: `${pipe.x}%`,
                width: `${pipeWidth}%`,
                height: `${pipe.y}%`,
                backgroundColor: "rgb(210, 32, 178)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: `${pipe.y + pipeGap}%`,
                left: `${pipe.x}%`,
                width: `${pipeWidth}%`,
                height: `${100 - (pipe.y + pipeGap)}%`,
                backgroundColor: "rgb(210, 32, 178)",
              }}
            />
          </React.Fragment>
        ))}
        {gameOver && (
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "100px",
              fontWeight: "bold",
              color: "rgb(255, 65, 65)",
            }}
          >
            GAME OVER
          </div>
        )}
        {!gameStarted && (
          <>
            {!gameOver ? (
              <>
                <p>Use Space-Bar to play.</p>
                <h2 id="gameTitle">🕊️Flappy Bird</h2>
                <button
                  onClick={startGame}
                  style={{
                    position: "absolute",
                    top: "60%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "30px",
                    padding: "10px 25px",
                    background: "rgb(41, 133, 255)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  START
                </button>
              </>
            ) : (
              <button
                onClick={startGame}
                style={{
                  position: "absolute",
                  top: "60%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "30px",
                  padding: "10px 25px",
                  background: "rgb(255, 41, 41)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                PLAY AGAIN
              </button>
            )}
          </>
        )}
        <div
          style={{
            textAlign: "right",
            position: "absolute",
            bottom: "10px",
            right: "10px",
            color: "white",
            fontSize: "18px",
            padding: "20px",
            borderRadius: "1.5rem",
            backgroundColor: "rgba(0, 140, 30, 0.7)",
          }}
        >
          Score: {score} <br />
          High Score: {highScore} <br />
          Speed: {pipeSpeed}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FlappyBirdGame;
