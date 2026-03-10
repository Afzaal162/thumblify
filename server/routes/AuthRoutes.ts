import { Router } from "express";
import { registerUser, loginUser, logoutUser, verifyUser } from "../controllers/AuthControllers";
import protect from "../middlewares/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/verify", protect, verifyUser);

export default router;
