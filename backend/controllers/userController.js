import User from "../models/user/user.js"
import bcrypt from "bcrypt"

// Register User
export const createUser = async (req, res) => {
    try {
        
        const { userName, email, password } = req.body;

        console.log(req.body);

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
            isLoggedIn: false,   // required by model
            isPlaying: false     // required by model
        });


        res.status(201).json({
            message: 'User registered successfully',
            userId: user.userId
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
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

        // Optional: Update isLoggedIn status
        user.isLoggedIn = true;
        await user.save();

        res.json({
            message: 'Login successful',
            userId: user.userId,
            name: user.userName
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
