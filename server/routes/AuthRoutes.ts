import { Router } from "express";
import { registerUser, loginUser, logoutUser, verifyUser } from "../controllers/authController.js";

const AuthRoute = Router();

// ===================== AUTH ROUTES =====================

// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Logout user
router.post("/logout", logoutUser);

// Verify user session
router.get("/verify", verifyUser);

export default AuthRoute;
