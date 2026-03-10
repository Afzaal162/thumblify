import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser
} from "../controllers/AuthController";
import protect from "../middlewares/auth";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.post("/logout", protect, logoutUser);
router.get("/verify", protect, verifyUser);

export default router;
