import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import connectDB from "./config/db.js";
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from "./routes/ThumbnailRoutes.js";

const app = express();

// Connect MongoDB
connectDB().catch(console.error);

// Middleware
app.use(express.json());

// Detect environment
const isProduction = process.env.NODE_ENV === "production";

// CORS
app.use(cors({
  origin: [
    "https://thumblify-frontend-pi.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));

// SESSION_SECRET check
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error("SESSION_SECRET is not defined in .env");

// Session config
app.use(session({
  name: "thumblify.sid",
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI! }),
  cookie: {
    httpOnly: true,
    secure: isProduction,         // true only in production (HTTPS)
    sameSite: isProduction ? "none" : "lax", // allow localhost dev
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);

// Health check
app.get("/", (req, res) => res.send("Backend running"));

export default app;
