import { Router } from "express";
// ✅ Use correct casing and add .js extension for ESM
import { registerUser, loginUser, logoutUser, verifyUser } from "../controllers/AuthControllers.js";
import protect from "../middlewares/auth.js";

const router = Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/verify", protect, verifyUser);

export default router;
