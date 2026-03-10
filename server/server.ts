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

// CORS setup
app.use(cors({
  origin: "https://thumblify-frontend-pi.vercel.app", // frontend domain
  credentials: true // allow cookies
}));

// Allow preflight requests for all routes
app.options("*", cors({
  origin: "https://thumblify-frontend-pi.vercel.app",
  credentials: true
}));

// Session setup
app.use(session({
  name: "thumblify.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    httpOnly: true,
    secure: true,       // must be true for HTTPS
    sameSite: "none",   // cross-domain cookies
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);

// Health check
app.get("/", (req, res) => res.send("Backend running"));

export default app;
