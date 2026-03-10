import { Request, Response } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

// REGISTER
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User Already Exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    req.session.isLoggedIn = true;
    req.session.userId = newUser._id;

    res.status(201).json({ message: "Registered & Logged In", user: { _id: newUser._id, name, email }});
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid Email or Password" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid Email or Password" });

    req.session.isLoggedIn = true;
    req.session.userId = user._id;

    res.json({ message: "Logged In", user: { _id: user._id, name: user.name, email } });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
export const logoutUser = (req: Request, res: Response) => {
  req.session.destroy((err: any) => {
    if (err) return res.status(500).json({ message: err.message });
    res.clearCookie('connect.sid');
    res.json({ message: "Logout Successful" });
  });
};

// VERIFY
export const verifyUser = async (req: Request, res: Response) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Not Authenticated" });

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(401).json({ message: "Invalid User" });

    res.json({ user });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
