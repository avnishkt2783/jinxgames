import { useAuth } from "../AuthContext";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "./FlappyBirdGame.css";

const gameId = 3;

const FlappyBirdGame = () => {
  const [birdY, setBirdY] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [pipeSpeed, setPipeSpeed] = useState(0.5); // 🌟 Initial slow speed
  const [startTime, setStartTime] = useState(null);

  const birdHeight = 5; // in %
  const birdWidth = 2; // in %
  const pipeWidth = 5; // in %
  const pipeGap = 40; // in % (gap between pipes)
  const gravity = 0.2;
  const jumpStrength = -2.5;

  const gameArea = useRef(null);

  const { user } = useAuth();

  const handleSpacebar = (e) => {
    if (e.code === "Space") {
      if (!gameStarted) {
        startGame();
      } else if (!gameOver) {
        setBirdVelocity(jumpStrength);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleSpacebar);
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
    setPipeSpeed(0.5); // Reset to easy mode
    setGameOver(false);
    setStartTime(new Date());
    setGameStarted(true);
  };

  // const endGame = () => {
  //   setGameOver(true);
  //   setGameStarted(false);
  //   setHighScore((prev) => Math.max(prev, score));
  // };

  const endGame = async () => {
    setGameOver(true);
    setGameStarted(false);
    setHighScore((prev) => Math.max(prev, score));

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("User not logged in, not recording match.");
      return;
    }

    const endTime = new Date();
    const timeTakenSeconds = Math.round((endTime - startTime) / 1000);

    try {
      await axios.post(
        "http://localhost:3000/api/solomatches",
        {
          gameId: 3,
          startTime,
          endTime,
          score,
          outcome: "scored",
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

  // const updateGame = () => {
  //   setBirdY((prevY) => prevY + birdVelocity);
  //   setBirdVelocity((prev) => prev + gravity);

  //   // 🌟 Update speed based on score
  //   setPipeSpeed(() => {
  //     if (score < 5) return 2; // easy
  //     else if (score < 10) return 3; // medium
  //     else if (score < 20) return 4; // hard
  //     else return 5; // max speed
  //   });

  //   setPipes((prevPipes) => {
  //     let scored = false;
  //     const newPipes = prevPipes.map((pipe) => {
  //       const movedPipe = { ...pipe, x: pipe.x - pipeSpeed };
  //       if (!pipe.passed && movedPipe.x + pipeWidth < 50) {
  //         pipe.passed = true;
  //         scored = true;
  //       }
  //       return movedPipe;
  //     });

  //     if (newPipes[0].x + pipeWidth < 0) {
  //       newPipes.shift();
  //       newPipes.push(generateNewPipe());
  //     }

  //     if (scored) setScore((prev) => prev + 1);

  //     return newPipes;
  //   });

  //   if (birdY + birdHeight > 400 || birdY < 0) {
  //     endGame();
  //   }

  //   pipes.forEach((pipe) => {
  //     if (
  //       pipe.x < 50 + birdWidth &&
  //       pipe.x + pipeWidth > 50 &&
  //       (birdY < pipe.y || birdY + birdHeight > pipe.y + pipeGap)
  //     ) {
  //       endGame();
  //     }
  //   });
  // };

  // Instead of raw pixels, use percentages of the container
  const updateGame = () => {
    const gameHeight = gameArea.current?.clientHeight || 1;
    const gameWidth = gameArea.current?.clientWidth || 1;

    setBirdY((prevY) => prevY + birdVelocity);
    setBirdVelocity((prev) => prev + gravity);

    // Collision with top/bottom
    if (birdY + birdHeight > 100 || birdY < 0) {
      endGame();
      return;
    }

    // Update pipes and check collisions
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

      // Bird collision with pipe
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

  // const generateNewPipe = (i = 0) => {
  //   const pipeHeight = Math.random() * (250 - 50) + 50;
  //   return {
  //     x: 600 + i * 200,
  //     y: pipeHeight,
  //     passed: false,
  //   };
  // };

  const generateNewPipe = (i = 0) => {
    const pipeHeight = Math.random() * 40 + 10; // between 10% and 50%
    return {
      x: 100 + i * 30, // start off-screen
      y: pipeHeight,
      passed: false,
    };
  };

  return (
    <>
      <Navbar />
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
        {/* Bird */}
        <div
          className="bird"
          style={{
            position: "absolute",
            top: `${birdY}%`,
            left: "5%",
            width: `${birdWidth}%`,
            height: `${birdHeight}%`,
            backgroundColor: "rgb(72, 237, 255)",
            borderRadius: "50%",
          }}
        />

        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <React.Fragment key={index}>
            {/* Top Pipe */}
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
            {/* Bottom Pipe */}
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

        {/* Game Over */}
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

        {/* Start Button */}
        {!gameStarted && (
          <>
            <p>Use Space-Bar to play.</p>
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
        )}

        {/* Score Display */}
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
    </>
  );
};

export default FlappyBirdGame;
