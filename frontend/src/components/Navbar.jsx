// import {Routes, Route, Link} from 'react-router-dom'
// import './Navbar.css'

// function Navbar(){
//     return(
//         <>
//         <nav className='navPanel'>
//             <div>
//             <Link to="/"><img src="jinx.png" className='navLogo'/></Link>
//             </div>
//             <div>
//             <Link to="/home" className='navLinks'>Home</Link>
//             <Link to="/games" className='navLinks'>Games</Link>
//             {/* <Link to="/login" className='navLinks'>Login</Link> */}

//             </div>
//         </nav>

//         </>
//     )
// }
// export default Navbar

import { Routes, Route, Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../AuthContext"; // ✅ make sure path is correct
import LogoutButton from "./LogoutButton"; // ✅ import the logout button
import ProfilePage from "./ProfilePage";

function Navbar() {
  const { token } = useAuth(); // ✅ check if user is logged in

  return (
    <>
      <nav className="navPanel">
        <div>
          <Link to="/">
            <img src="jinx.png" className="navLogo" />
          </Link>
        </div>
        <div>
          <Link to="/home" className="navLinks">
            Home
          </Link>
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
            </Link> // ✅ show login if logged out
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
