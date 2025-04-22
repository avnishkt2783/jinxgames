import axios from "axios";
// import InputField from "./InputField"
import InputField from "./InputField";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Form.css";
import { useAuth } from "../AuthContext";
import AuthNavbar from "./AuthNavbar";
import "./Universal.css";
import Footer from "./Footer";

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const { login } = useAuth();

  const validateForm = () => {
    const usernameRegex = /^[A-Za-z][A-Za-z0-9_]*$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;

    if (!usernameRegex.test(form.userName)) {
      return "Username must start with a letter and contain only letters, numbers, or underscores.";
    }
    if (!passwordRegex.test(form.password)) {
      return "Password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      setIsSuccess(false);
      return;
    }
    try {
      const { confirmPassword, ...formData } = form; // exclude confirmPassword
      const response = await axios.post(
        "http://localhost:3000/api/register",
        formData
      );

      const { token } = response.data;
      login(token);

      setMessage("Registration successful!");
      setIsSuccess(true);
      setForm({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setUser(response.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed!");
      setIsSuccess(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <>
      <AuthNavbar />
      <div className="form-container">
        <h2 className="form-heading">Welcome Player!</h2>
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
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
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
          <InputField
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="form-button">
            Register
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
            Already Registered : <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default RegistrationForm;
