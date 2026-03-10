import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// ===================== REGISTER =====================
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User Already Exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // ⚠️ cast session to any
    const session = req.session as any;
    session.isLoggedIn = true;
    session.userId = newUser._id.toString();

    return res.status(201).json({
      message: "Account Registered & Logged In Successfully",
      user: { _id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ===================== LOGIN =====================
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid Email or Password" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid Email or Password" });

    const session = req.session as any;
    session.isLoggedIn = true;
    session.userId = user._id.toString();

    return res.json({
      message: "Account Logged In Successfully",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ===================== LOGOUT =====================
export const logoutUser = async (req: Request, res: Response) => {
  try {
    req.session.destroy((err: any) => {
      if (err) return res.status(500).json({ message: err.message });

      res.clearCookie("connect.sid");
      return res.json({ message: "Logout Successful" });
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ===================== VERIFY USER =====================
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const session = req.session as any;
    const userId = session.userId;

    if (!userId) return res.status(401).json({ message: "Not Authenticated" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid User" });

    return res.json({ user });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
