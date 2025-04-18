import { useState, useEffect } from "react";
import axios from "axios";
import InputField from "./InputField";
import { useNavigate } from "react-router-dom";
import "./Form.css";

const LoginForm = () => {
    const [form, setForm] = useState({
        userName: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/user/login", form);

            setMessage(response.data?.message || "Login successful!");
            setIsSuccess(true);
            setForm({
                userName: "",
                password: ""
            });
            setUser(response.data);
        } catch (err) {
            setMessage(err.response?.data?.error || "Login failed! Please try again.");
            setIsSuccess(false);
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/Home');
        }
    }, [user, navigate]);

    return (
        // <form onSubmit={handleSubmit}>
        //     <InputField
        //         type="text"
        //         name="userName"
        //         placeholder="Enter Username"
        //         value={form.userName}
        //         onChange={handleChange}
        //         required
        //     />
        //     <InputField
        //         type="password"
        //         name="password"
        //         placeholder="Enter Password"
        //         value={form.password}
        //         onChange={handleChange}
        //         required
        //     />
        //     <button type="submit">Login</button>
        //     {message && (
        //         <p style={{ color: isSuccess ? "green" : "red", marginTop: "10px" }}>
        //             {message}
        //         </p>
        //     )}
        // </form>

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
                <button type="submit" className="form-button">Login</button>
                {message && (
                    <p
                        className="form-message"
                        style={{ color: isSuccess ? "green" : "red" }}
                    >
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginForm;
