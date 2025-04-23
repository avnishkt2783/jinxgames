import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ className }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <a id="logoutBtn" className={className} onClick={handleLogout}>
      Logout
    </a>
  );
};

export default LogoutButton;
