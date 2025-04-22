import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import "./Universal.css";
import Footer from "./Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="landing-container">
        <img id="logo" src="jinx.png" alt="" />
        <p className="tagline">Unleash the fun. Compete. Win.</p>

        <div className="button-group">
          <button onClick={() => navigate("/login")} className="btn">
            Login
          </button>
          <button onClick={() => navigate("/register")} className="btn">
            Register
          </button>
          <button onClick={() => navigate("/games")} className="btn">
            Enter Website
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
