import { Request, Response } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

// ===================== REGISTER =====================
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User Already Exists' });
    }

    // 2️⃣ Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3️⃣ Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // 4️⃣ Set session
    req.session.isLoggedIn = true;
    req.session.userId = newUser._id;

    return res.status(201).json({
      message: 'Account Registered & Logged In Successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// ===================== LOGIN =====================
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    // 2️⃣ Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    // 3️⃣ Set session
    req.session.isLoggedIn = true;
    req.session.userId = user._id;

    return res.json({
      message: 'Account Logged In Successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// ===================== LOGOUT =====================
export const logoutUser = async (req: Request, res: Response) => {
  try {
    req.session.destroy((error: any) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
      }
      res.clearCookie('connect.sid'); // remove session cookie from browser
      return res.json({ message: 'Logout Successful' });
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// ===================== VERIFY USER =====================
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;

    if (!userId) {
      return res.status(401).json({ message: 'Not Authenticated' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid User' });
    }

    return res.json({ user });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};