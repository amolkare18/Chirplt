import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashed });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username });
  
      if (!user) 
        return res.status(400).json({ message: "Invalid credentials no username exists" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) 
        return res.status(400).json({ message: "Invalid credentials no password matching" });
  
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
  
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 15 * 60 * 1000 // 15 minutes
      });
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
  
      res.status(200).json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email
        }
      });
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

export const logout = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};
