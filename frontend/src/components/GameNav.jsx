import React from "react";
import { useNavigate } from "react-router-dom";
import "./GameNav.css";

const GameNav = ({ instructions }) => {
  const navigate = useNavigate();

  return (
    <nav className="gameNav">
      <button id="gameNav-back" onClick={() => navigate("/games")}>
        Back to Games
      </button>
      <button id="gameNav-info" onClick={() => alert(instructions)}>
        Instructions
      </button>
    </nav>
  );
};

export default GameNav;
