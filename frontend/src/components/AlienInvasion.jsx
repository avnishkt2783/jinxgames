import React, { useEffect, useState } from "react";
import Player from "./Player";
import Alien from "./Alien";
import Bullet from "./Bullet";
import AlienBullet from "./AlienBullet";
import Brick from "./Brick";

import "./AlienInvasion.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GameNav from "./GameNav";

import axios from "axios";

const AlienInvasion = () => {
  const apiURL = import.meta.env.VITE_API_URL;
  const alienInvasionInstructions = `
Instructions for Alien Invasion!
- Use arrow keys to move your spaceship.
- Press the spacebar to shoot lasers at incoming aliens.
- Destroy all aliens while dodging their attacks.
- Finish all Aliens to win the game!
`;

  const [playerX, setPlayerX] = useState(225);
  const [bullets, setBullets] = useState([]);
  const [alienBullets, setAlienBullets] = useState([]);
  const [aliens, setAliens] = useState([]);
  const [bricks, setBricks] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [canShoot, setCanShoot] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [direction, setDirection] = useState("down");
  const [paused, setPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [bulletsFired, setBulletsFired] = useState(0);
  const shootDelay = 750;

  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const res = await axios.get(`${apiURL}/solomatches/highscore/5`);
        setHighScore(res.data.highScore);
      } catch (err) {
        console.error("Failed to fetch high score:", err);
      }
    };

    fetchHighScore();
  }, []);

  const initGame = () => {
    const newAliens = [];
    for (let i = 0; i < 18; i++) {
      newAliens.push({ x: (i % 6) * 70 + 30, y: Math.floor(i / 6) * 50 + 30 });
    }
    setAliens(newAliens);

    const brickGroup = [];
    const positions = [50, 200, 350];
    positions.forEach((xOffset) => {
      for (let i = 0; i < 9; i++) {
        brickGroup.push({
          x: xOffset + (i % 3) * 20,
          y: 400 + Math.floor(i / 3) * 15,
          health: 5,
        });
      }
    });

    setBricks(brickGroup);
    setBullets([]);
    setAlienBullets([]);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setCanShoot(true);
    setStartTime(new Date());
    setBulletsFired(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      if (gameOver || gameWon || paused) return;

      if (e.key === "ArrowLeft") setPlayerX((x) => Math.max(0, x - 15));
      if (e.key === "ArrowRight") setPlayerX((x) => Math.min(470, x + 15));
      if (e.key === " " && canShoot) {
        setBullets((prev) => [...prev, { x: playerX + 15, y: 430 }]);
        setBulletsFired((prev) => prev + 1);
        setCanShoot(false);
        setTimeout(() => setCanShoot(true), shootDelay);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerX, canShoot, gameOver, gameWon, paused]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameOver || gameWon || paused) return;

      setBullets((prev) =>
        prev.map((b) => ({ ...b, y: b.y - 10 })).filter((b) => b.y > 0)
      );
      setAlienBullets((prev) =>
        prev.map((b) => ({ ...b, y: b.y + 10 })).filter((b) => b.y < 500)
      );

      if (Math.random() < 0.1 && aliens.length > 0) {
        const shooter = aliens[Math.floor(Math.random() * aliens.length)];
        setAlienBullets((prev) => [
          ...prev,
          { x: shooter.x + 10, y: shooter.y + 20 },
        ]);
      }

      setAliens((prevAliens) =>
        prevAliens.map((a) => {
          const nearBrick = bricks.find(
            (brick) =>
              a.x >= brick.x - 20 &&
              a.x <= brick.x + 20 &&
              a.y + 20 >= brick.y &&
              a.y + 20 <= brick.y + 20
          );
          if (nearBrick && direction === "down") setDirection("up");
          else if (a.y <= 20 && direction === "up") setDirection("down");

          return { ...a, y: direction === "down" ? a.y + 2 : a.y - 2 };
        })
      );

      alienBullets.forEach((b) => {
        if (b.x >= playerX && b.x <= playerX + 30 && b.y >= 440 && b.y <= 460) {
          setGameOver(true);
          saveMatch("lose");
        }
      });

      setAliens((prevAliens) => {
        const remaining = [];
        prevAliens.forEach((a) => {
          const hit = bullets.find(
            (b) =>
              b.x >= a.x && b.x <= a.x + 20 && b.y >= a.y && b.y <= a.y + 20
          );
          if (hit) {
            setScore((s) => s + 1);
            setBullets((b) => b.filter((bb) => bb !== hit));
          } else {
            remaining.push(a);
          }
        });
        if (remaining.length === 0) {
          setGameWon(true);
          saveMatch("win");
        }
        return remaining;
      });

      setBricks((prev) =>
        prev
          .map((brick) => {
            const hit = alienBullets.find(
              (b) =>
                b.x >= brick.x &&
                b.x <= brick.x + 15 &&
                b.y >= brick.y &&
                b.y <= brick.y + 15
            );
            if (hit) {
              setAlienBullets((b) => b.filter((bb) => bb !== hit));
              return { ...brick, health: brick.health - 1 };
            }
            return brick;
          })
          .filter((b) => b.health > 0)
      );

      setBullets((prevBullets) =>
        prevBullets.filter((b) => {
          const collided = alienBullets.find(
            (ab) => Math.abs(ab.x - b.x) < 10 && Math.abs(ab.y - b.y) < 10
          );
          if (collided) {
            setAlienBullets((a) => a.filter((ab) => ab !== collided));
            return false;
          }
          return true;
        })
      );
    }, 100);

    const saveMatch = async (outcome) => {
      try {
        const token = localStorage.getItem("token");
        const endTime = new Date();
        await axios.post(
          `${apiURL}/solomatches`,
          {
            gameId: 5,
            startTime,
            endTime,
            score,
            outcome,
            metadata: {
              bricksRemaining: bricks.length,
              bulletsFired,
              aliensKilled: 18 - aliens.length,
              duration: `${Math.round((endTime - startTime) / 1000)}s`,
              highScore,
              finalScore: score,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Failed to save Alien Invasion match:", error);
      }
    };

    return () => clearInterval(interval);
  }, [
    bullets,
    alienBullets,
    aliens,
    direction,
    bricks,
    playerX,
    gameOver,
    gameWon,
    paused,
  ]);

  const handleRestart = () => {
    initGame();
  };

  const handlePause = () => {
    setPaused(!paused);
  };

  return (
    <>
      <Navbar />
      <GameNav instructions={alienInvasionInstructions} />
      <div className="alien-invasion-container">
        <div className="topBar">
          <span>Score: {score}</span>
          <span>High Score: {highScore}</span>
        </div>
        <button id="alien-invasion-buttonPauseResume" onClick={handlePause}>
          {paused ? "Resume" : "Pause"}
        </button>

        {(gameOver || gameWon) && (
          <div className="game-message">
            <h1>{gameOver ? "Game Over" : "🎉 You Win!"}</h1>
            <p>Final Score: {score}</p>
            <p>High Score: {highScore}</p>
            <button onClick={handleRestart}>Restart</button>
          </div>
        )}

        <svg width="500" height="500" style={{ background: "black" }}>
          <Player x={playerX} />
          {aliens.map((a, i) => (
            <Alien key={i} x={a.x} y={a.y} />
          ))}
          {bullets.map((b, i) => (
            <Bullet key={i} x={b.x} y={b.y} />
          ))}
          {alienBullets.map((ab, i) => (
            <AlienBullet key={i} x={ab.x} y={ab.y} />
          ))}
          {bricks.map((brick, i) => (
            <Brick key={i} x={brick.x} y={brick.y} health={brick.health} />
          ))}
        </svg>
      </div>
      <Footer />
    </>
  );
};

export default AlienInvasion;
