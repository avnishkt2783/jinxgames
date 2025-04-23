import { Link } from "react-router-dom";
import "./Navbar.css";

function AuthNavbar() {
  return (
    <>
      <nav className="navPanel">
        <div>
          <Link to="/">
            <img src="jinx.png" className="navLogo" />
          </Link>
        </div>
        <div>
          <Link to="/games" className="navLinks">
            Games
          </Link>
        </div>
      </nav>
    </>
  );
}
export default AuthNavbar;
