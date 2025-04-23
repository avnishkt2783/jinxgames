import { useState, useEffect } from "react";
import axios from "axios";
import InputField from "./InputField";

import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Form.css";
import AuthNavbar from "./AuthNavbar";
import "./Universal.css";
import Footer from "./Footer";

const LoginForm = () => {
  const apiURL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiURL}/login`, form);

      const { token } = response.data;
      login(token);
      setIsSuccess(true);
      setMessage(response.data?.message || "Login successful!");
      setForm({
        userName: "",
        password: "",
      });
      setUser(response.data);
    } catch (err) {
      setMessage(
        err.response?.data?.error || "Login failed! Please try again."
      );
      setIsSuccess(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <>
      <AuthNavbar />
      <div className="form-container">
        <h2 className="form-heading">Welcome Back!</h2>
        <form onSubmit={handleSubmit} className="form-wrapper">
          <InputField
            type="text"
            name="userName"
            placeholder="Enter Username"
            value={form.userName}
            onChange={handleChange}
            required
          />
          <InputField
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="form-button">
            Login
          </button>
          {message && (
            <p
              className="form-message"
              style={{ color: isSuccess ? "green" : "red" }}
            >
              {message}
            </p>
          )}
          <p>
            New Here?{" "}
            <Link to="/register">
              <button className="form-button">Register</button>
            </Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default LoginForm;
