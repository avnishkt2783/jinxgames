import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import Footer from "./Footer";

const GroupMembersPage = () => {
  const apiURL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${apiURL}/games`)
      .then((res) => res.json())
      .then((data) => setGames(data.games))
      .catch((err) => console.error("Error fetching games:", err));

    const handleScroll = () => {
      document.querySelectorAll(".bullet-item").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
          el.classList.add("slide-in");
          el.classList.remove("slide-out");
        } else {
          el.classList.remove("slide-in");
          el.classList.add("slide-out");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const members = [
    {
      name: "Arobh Kumar",
      role: "Developer",
      image: "/arobh.jpg",
      description: ["aarobhs087@gmail.com", "+91 62026 78690"],
    },
    {
      name: "Avnish Kumar",
      role: "Developer",
      image: "/avnish.jpg",
      description: ["avnishkt2783@gmail.com", "+91 70339 74269"],
    },
    {
      name: "Mukesh Kumar Patel",
      role: "Developer",
      image: "/mukesh.jpg",
      description: ["mukeshpatelbth65@gmail.com", "+91 73012 70260"],
    },
    {
      name: "Nisha Ranjan",
      role: "Developer",
      image: "/nisha.jpg",
      description: ["ranjannisha349@gmail.com", "+91 62034 57446"],
    },
    {
      name: "Simran Sahiwal",
      role: "Developer",
      image: "/simran.jpg",
      description: ["sahiwalsimran@gmail.com", "+91 62061 24541"],
    },
  ];

  return (
    <div className="group-members-container">
      <h2>Meet Our Team</h2>
      <div className="cards-container">
        {members.map((member, index) => (
          <div key={index} className="member-card">
            <div className="member-card-inner">
              <div className="member-card-front">
                <img
                  src={member.image}
                  alt={member.name}
                  className="member-image"
                />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
              <div className="member-card-back">
                {member.description.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const apiURL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [loadRotate, setLoadRotate] = useState(true);
  const [scrollRotate, setScrollRotate] = useState(false);

  const landingRef = useRef();

  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch(`${apiURL}/games`)
      .then((res) => res.json())
      .then((data) => setGames(data.games))
      .catch((err) => console.error("Error fetching games:", err));
  }, []);

  useEffect(() => {
    setTimeout(() => setLoadRotate(false), 1000);

    const handleScroll = () => {
      if (landingRef.current) {
        const landingHeight = landingRef.current.offsetHeight;
        const isScrolled = window.scrollY >= landingHeight;
        setScrolled(isScrolled);

        if (isScrolled) {
          setScrollRotate(true);
          setTimeout(() => setScrollRotate(false), 600);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rotationClass = loadRotate
    ? "rotate-on-load"
    : scrollRotate
    ? "rotate-on-scroll"
    : "";

  return (
    <>
      <div ref={landingRef} className={`landing-container ${rotationClass}`}>
        <img
          id="logo"
          src="jinx.png"
          alt="Jinx Logo"
          className={scrolled ? "logo-small" : ""}
        />
        <p className={`tagline ${scrolled ? "fade-out" : ""}`}>
          Unleash the fun. Compete. Win.
        </p>
      </div>

      <section className="info-section game-world-section">
        <div className="content-box with-image">
          <div className="text-content zoom-in">
            <h1>🎮 Welcome to JINXGames!</h1>
            <p>
              Dive into a curated collection of fun and challenging games, from
              classics like Snake and Hangman to fast-paced action like Flappy
              Bird. Whether you're testing your memory or battling it out in
              Rock Paper Scissors, there's something here for every gamer.{" "}
              <br />
              <br />
              Pick a game, start playing, and see how high you can score!
            </p>
          </div>
          <div className="image-content">
            <img
              src="/jinx_scene1.gif"
              alt="Gaming Universe"
              className="animated-img"
            />
          </div>
        </div>
      </section>

      <section className="bullet-list-section">
        <h2 className="bullet-list-title">🎮 Explore Our Games</h2>
        <ul className="bullet-list">
          {games.map((game) => (
            <li key={game.gameId} className="bullet-item">
              <span className="bullet-dot">•</span>
              <span>
                <strong>{game.gameName}</strong> — <em>{game.gameDesc}</em>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="group-members-section">
        <GroupMembersPage />
      </section>

      <button onClick={() => navigate("/games")} className="btn enter-btn">
        <span>Enter Website</span>
      </button>
      <Footer />
    </>
  );
};

export default LandingPage;
