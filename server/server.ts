import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import connectDB from "./config/db.js";
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from "./routes/ThumbnailRoutes.js";

const app = express();

// --------------------
// 1️⃣ Connect MongoDB
// --------------------
connectDB().catch(console.error);

// --------------------
// 2️⃣ CORS Middleware
// Must be before session and routes
// --------------------
app.use(cors({
  origin: "https://thumblify-frontend-pi.vercel.app", // exact frontend URL
  credentials: true,                                   // allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests globally
app.options("*", cors());

// --------------------
// 3️⃣ Body parser
// --------------------
app.use(express.json());

// --------------------
// 4️⃣ Session setup
// --------------------
app.use(session({
  name: "thumblify.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    httpOnly: true,
    secure: true,         // ⚠️ must be HTTPS (Vercel production is HTTPS)
    sameSite: "none",     // allows cross-site cookies
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// --------------------
// 5️⃣ Routes
// --------------------
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);

// --------------------
// 6️⃣ Health check
// --------------------
app.get("/", (req, res) => res.send("Backend running"));

export default app;
