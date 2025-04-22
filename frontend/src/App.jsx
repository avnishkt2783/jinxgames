import "./App.css";
import { Route, Routes } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import ProfilePage from "./components/ProfilePage";

import RequireAuth from "./utils/RequireAuth";

import GamesPage from "./components/GamesPage";
import RPSGame from "./components/RPSGame";
import MemoryGame from "./components/MemoryGame";
import FlappyBirdGame from "./components/FlappyBirdGame";
import HangmanGame from "./components/HangmanGame";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/games" element={<GamesPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/memory" element={<MemoryGame />} />
          <Route path="/rps" element={<RPSGame />} />
          <Route path="/flappybird" element={<FlappyBirdGame />} />
          <Route path="/hangman" element={<HangmanGame />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
