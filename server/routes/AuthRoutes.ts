import express from 'express';
import { loginUser, logoutUser, registerUser, verifyUser } from '../controllers/AuthControllers.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

// ================= POST routes (actual API) =================
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify', protect, verifyUser);
router.post('/logout', protect, logoutUser);

// ================= GET route for friendly browser message =================
router.get('/login', (req, res) => {
  res.send("POST /api/auth/login with JSON body {email, password} to log in.");
});

router.get('/register', (req, res) => {
  res.send("POST /api/auth/register with JSON body {name, email, password} to register.");
});

export default router;
