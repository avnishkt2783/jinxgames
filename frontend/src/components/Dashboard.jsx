import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../AuthContext";
import "./Dashboard.css";

const featuredGames = [
  {
    id: 1,
    name: "Flappy Bird Game",
    image: "/flappybirdImage.png",
    link: "/flappybird",
  },
  {
    id: 2,
    name: "Mosquito Game",
    image: "/mosquitoImage.png",
    link: "/mosquito",
  },
  {
    id: 3,
    name: "Alien Invasion",
    image: "/alieninvasionImage.png",
    link: "/alieninvasion",
  },
  {
    id: 4,
    name: "Snake Game",
    image: "/snakeImage.png",
    link: "/snake",
  },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">
          Welcome, {user?.userName || "Player"} 👋
        </h1>

        <div className="carousel-container">
          <div className="carousel">
            {[...featuredGames, ...featuredGames].map((game, index) => (
              <a
                key={`${game.id}-${index}`}
                href={game.link}
                className="carousel-item"
                style={{ backgroundImage: `url(${game.image})` }}
                title={game.name}
              >
                <div className="carousel-title">{game.name}</div>
              </a>
            ))}
          </div>
        </div>

        <section className="featured-section">
          <h2>🔥 Featured Games</h2>
          <div className="featured-list">
            <Link to="/rps" className="featured-game-link">
              <div className="featured-game">
                <img src="/rpsImage.png" alt="RPS" />
                <p>Rock Paper Scissors</p>
              </div>
            </Link>
            <Link to="/memory" className="featured-game-link">
              <div className="featured-game">
                <img src="/memoryImage.png" alt="Memory" />
                <p>Memory Game</p>
              </div>
            </Link>
            <Link to="/tictactoe" className="featured-game-link">
              <div className="featured-game">
                <img src="/tictactoeImage.png" alt="Tic Tac Toe" />
                <p>Tic Tac Toe</p>
              </div>
            </Link>
            <Link to="/hangman" className="featured-game-link">
              <div className="featured-game">
                <img src="/hangmanImage.png" alt="Hangman" />
                <p>Hangman</p>
              </div>
            </Link>
            <Link to="/flappybird" className="featured-game-link">
              <div className="featured-game">
                <img src="/flappybirdImage.png" alt="Flappy Bird" />
                <p>Flappy Bird</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
