import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'

const LandingPage = () => {
    const navigate = useNavigate();

    return(
        <div className="landing-container">
        <img id="logo" src="jinx.png" alt="" />
        {/* <h1 className="title">🎮 JinxGames</h1> */}
        <p className="tagline">Unleash the fun. Compete. Win.</p>
        
        <div className="button-group">
            <button onClick={() => navigate('/login')} className="btn">Login</button>
            <button onClick={() => navigate('/register')} className="btn">Register</button>
            <button onClick={() => navigate('/home')} className="btn">Enter Website</button>
        </div>
    </div>
  );
};

export default LandingPage;
