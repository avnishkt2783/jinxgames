import { Routes, Route, Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../AuthContext";
import LogoutButton from "./LogoutButton";

function Navbar() {
  const { token } = useAuth();

  return (
    <>
      <nav className="navPanel">
        <div>
          <Link to="/">
            <img src="jinx.png" className="navLogo" />
          </Link>
        </div>
        <div>
          {token ? (
            <>
              <Link to="/dashboard" className="navLinks">
                Dashboard
              </Link>
            </>
          ) : (
            <></>
          )}

          <Link to="/games" className="navLinks">
            Games
          </Link>

          {token ? (
            <>
              <LogoutButton className="navLinks" />
              <Link to="/profile" className="navLinks">
                Profile
              </Link>
            </>
          ) : (
            <Link to="/login" className="navLinks">
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
