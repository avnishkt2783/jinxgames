import "./App.css";
import { Route, Routes } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import ProfilePage from "./components/ProfilePage";
import GamesPage from "./components/GamesPage";

import RequireAuth from "./utils/RequireAuth";

import MemoryGame from "./components/MemoryGame";
import RPSGame from "./components/RPSGame";
import FlappyBirdGame from "./components/FlappyBirdGame";
import HangmanGame from "./components/HangmanGame";
import AlienInvasionGame from "./components/AlienInvasion";
import TicTacToeGame from "./components/TicTacToe";
import MosquitoGame from "./components/MosquitoGame";
import SnakeGame from "./components/SnakeGame";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/games" element={<GamesPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/memory" element={<MemoryGame />} />
          <Route path="/rps" element={<RPSGame />} />
          <Route path="/flappybird" element={<FlappyBirdGame />} />
          <Route path="/hangman" element={<HangmanGame />} />
          <Route path="/alieninvasion" element={<AlienInvasionGame />} />
          <Route path="/tictactoe" element={<TicTacToeGame />} />
          <Route path="/mosquito" element={<MosquitoGame />} />
          <Route path="/snake" element={<SnakeGame />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
