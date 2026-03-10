import express from "express";
import { registerUser, loginUser, logoutUser, verifyUser } from "../controllers/AuthControllers.js";
import protect from "../middlewares/auth.js";

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/verify", protect, verifyUser);

export default router;
