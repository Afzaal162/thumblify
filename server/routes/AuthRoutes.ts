import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser
} from "../controllers/AuthControllers.js"; // match your file name exactly

import protect from "../middlewares/auth.js"; // match your file name exactly

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.post("/logout", protect, logoutUser);
router.get("/verify", protect, verifyUser);

export default router;
