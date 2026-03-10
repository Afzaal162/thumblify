import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// ===== REGISTER =====
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User Already Exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Save user in session
    const session = req.session as any;
    session.user = { _id: newUser._id, name: newUser.name, email: newUser.email };

    return res.status(201).json({
      message: "Account Registered & Logged In Successfully",
      user: session.user
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
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid Email or Password" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid Email or Password" });

    const session = req.session as any;
    session.user = { _id: user._id, name: user.name, email: user.email };

    return res.json({
      message: "Account Logged In Successfully",
      user: session.user
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
      res.clearCookie("thumblify.sid"); // must match cookie name in session config
      return res.json({ message: "Logout Successful" });
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// ===== VERIFY =====
export const verifyUser = (req: Request, res: Response) => {
  const session = req.session as any;
  if (!session.user) return res.status(401).json({ message: "Not Authenticated" });

  return res.json({ user: session.user });
};
