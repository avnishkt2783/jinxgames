import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();

import User from "../models/user/user.js";
import Auth from "../models/auth/auth.js";

export const createUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const existingUserName = await User.findOne({where: {userName}});
        if(existingUserName){
            return res.status(400).json({error: 'Username already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
            isLoggedIn: false,   
            isPlaying: false    
        });

        const token = jwt.sign(
            {id: user.userId, userName: user.userName, email: user.email},
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.TOKEN_EXPIRY || "1h"}
        );

        await Auth.create({
            userId: user.userId,
            token: token,
        });

        res.status(201).json({
            message: 'User registered successfully',
            userId: user.userId,
            userName: user.userName,
            email: user.email,
            token
        });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const user = await User.findOne({ where: { userName } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            {id: user.userId, userName: user.userName, email: user.email},
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.TOKEN_EXPIRY || "1h"}
        );

        await Auth.create({
            userId: user.userId,
            token: token,
        });

        // Optional: Update isLoggedIn status
        user.isLoggedIn = true;
        await user.save();

        res.status(200).json({
            message: 'Login Successful',
            userId: user.userId,
            userName: user.userName,
            email: user.email,
            token
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: 'Internal Server error' });
    }
};

export const getUserProfile = async (req, res) => {
    try{
        const user = await User.findOne({
            where: { userName: req.user.userName }
        });
        
        if(!user) return res.status(404).json({ message: 'User not found'});
        
        res.status(200).json(user);
    }
    catch(err){
        console.error("Profile error:", err);
        res.status(500).json({ message: 'Internal Server Error'});
    }
};

export const getAllUsers = async (req, res) => {
    try{
        const users = await User.findAll({
            // attributes: ['userId', 'userName', 'email', ...]
        });

        res.json(users);
    }
    catch(err){
        console.error("Get all users error:", err);
        res.status(500).json({ message: 'Internal Server Error'})
    }
}

export const logoutUser = async (req, res) => {
    const { userName } = req.params;

    if(!userName) {
        return res.status(400).json({ message: 'Username is required'})
    }

    try{
        const user = await User.findOne({ where: { userName } });
        
        if (!user) {
            return res.status(404).json({ message: 'Server error during logout.' });
        }

        await Auth.destroy({
            where: { userId: user.userId }
        });

        // Update user status
        user.isLoggedIn = false;
        await user.save();

        res.status(200).json({ message: 'Logout Successful. Token Deleted.'});
    }
    catch(err){
        console.error('Error during logout:', err);
        res.status(500).json({ message: 'Server error during logout.' })  
    }
}