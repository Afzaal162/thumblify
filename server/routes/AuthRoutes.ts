import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser
} from "../controllers/AuthController.js";
import protect from "../middlewares/protect.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.post("/logout", protect, logoutUser);
router.get("/verify", protect, verifyUser);

export default router;
