import { Link } from "react-router-dom";
import "./Navbar.css";

function AuthNavbar() {
  return (
    <>
      <nav className="navPanel">
        {/* <Link to="jinx.png" alt="" /> */}
        <div>
          <Link to="/">
            <img src="jinx.png" className="navLogo" />
          </Link>
        </div>
        {/* <br /> */}
        <div>
          {/* <Link to="/Home" className='navLinks'>Home</Link> */}
          <Link to="/games" className="navLinks">
            Games
          </Link>
          {/* <Link to="/login" className='navLinks'>Login</Link> */}
        </div>
      </nav>
    </>
  );
}
export default AuthNavbar;
