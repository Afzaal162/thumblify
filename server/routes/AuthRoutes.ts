import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser
} import { registerUser, loginUser, logoutUser, verifyUser } from "../controllers/AuthControllers";
import protect from "../middlewares/auth";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.post("/logout", protect, logoutUser);
router.get("/verify", protect, verifyUser);

export default router;
