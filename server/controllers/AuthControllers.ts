import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// ===== REGISTER =====
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User Already Exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Save userId in session for authentication
    const session = req.session as any;
    session.userId = newUser._id;

    return res.status(201).json({
      message: "Account Registered & Logged In Successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// ===== LOGIN =====
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid Email or Password" });

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid Email or Password" });

    // Save userId in session
    const session = req.session as any;
    session.userId = user._id;

    return res.json({
      message: "Account Logged In Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// ===== LOGOUT =====
export const logoutUser = async (req: Request, res: Response) => {
  try {
    req.session.destroy((err: any) => {
      if (err) return res.status(500).json({ message: err.message });
      res.clearCookie("thumblify.sid"); // Must match session cookie name
      return res.json({ message: "Logout Successful" });
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// ===== VERIFY =====
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const session = req.session as any;

    // Check if user is logged in
    if (!session.userId) {
      return res.status(401).json({ message: "Not Authenticated" });
    }

    const user = await User.findById(session.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid User" });

    return res.json({ user });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
