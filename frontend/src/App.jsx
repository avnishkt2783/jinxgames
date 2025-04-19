import './App.css'
import { Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm'
import GamesPage from './components/GamesPage'

function App() {
  return (
    <>
      <Routes>

        <Route path="/" element={
            <>
              <LandingPage />
            </>
          } />

          <Route path="/home" element={<Home />} />
          
          <Route path="/login" element={
            <>
              <LoginForm />
            </>
          } />
          
          <Route path="/register" element={
            <>
              <RegistrationForm />
            </>
          } />

          <Route path="/games" element={
            <>
              <GamesPage />
            </>
          } />

      </Routes>
    </>
  );
}

export default App