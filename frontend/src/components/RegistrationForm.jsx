import axios from "axios";
// import InputField from "./InputField"
import InputField from "./InputField";
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Form.css";

const RegistrationForm = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        userName: "",
        email: "",
        password: ""
    })

    const [message, setMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [user, setUser] = useState(null);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.post("http://localhost:3000/api/user/register", form)

            setMessage("Registration successful!")
            setIsSuccess(true)
            setForm({
                userName: "",
                email: "",
                password: ""
            })
            setUser(response.data)
        }
        catch(err){
            setMessage(err.response?.data?.error || "Registration failed!")
            setIsSuccess(false)
        }
    };

    useEffect(() => {
        if (user) {
        navigate('/Home');
        }
    }, [user, navigate]);


    return(
        // <form onSubmit={handleSubmit}>
        //     <InputField type="text" name="userName" placeholder="Enter Username" value={form.userName} onChange={handleChange} required/>
        //     <InputField type="email" name="email" placeholder="Enter Email" value={form.email} onChange={handleChange} required/>
        //     <InputField type="password" name="password" placeholder="Enter Password" value={form.password} onChange={handleChange} required/>
            
        //     <button type="submit">Register</button>
        //     {message && (
        //         <p style={{ color: isSuccess ? "green" : "red", marginTop: "10px" }}>
        //             {message}
        //         </p>
        //     )}
        // </form>

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
                <button type="submit" className="form-button">Register</button>
                {message && (
                    <p
                        className="form-message"
                        style={{ color: isSuccess ? "green" : "red" }}
                    >
                        {message}
                    </p>
                )}
                <p>Already Registered : <Link to="/login">Login</Link></p>
            </form>
        </div>
    )
}

export default RegistrationForm