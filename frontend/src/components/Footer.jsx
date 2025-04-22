import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} JINXGames. All rights reserved.</p>
      <div className="footer-links"></div>
    </footer>
  );
};

export default Footer;
