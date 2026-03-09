import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import connectDB from "../config/db.js";
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from "./routes/ThumbnailRoutes.js";

const app = express();
app.use(express.json());

// ------------------- Connect to MongoDB -------------------
try {
  await connectDB();
  console.log("✅ MongoDB connected");
} catch (err) {
  console.error("❌ MongoDB connection failed:", err);
  process.exit(1); // stop server if DB is unreachable
}

// ------------------- CORS -------------------
const allowedOrigins = [
  "https://thumblify-frontend-pi.vercel.app", // Production
  "http://localhost:5173"                     // Local dev
];

app.use(cors({
  origin: (origin, callback) => {
    try {
      if (!origin) return callback(null, true); // Postman / curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn("⚠️ CORS warning: Unknown origin:", origin);
      return callback(null, true); // allow unknown origins but log
    } catch (err) {
      console.error("CORS ERROR:", err);
      return callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ------------------- Preflight OPTIONS -------------------
app.options("*", (req, res) => {
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }
  res.sendStatus(200);
});

// ------------------- TRUST PROXY -------------------
app.set("trust proxy", 1); // required for secure cookies on Vercel

// ------------------- SESSION -------------------
const mongoUrl = process.env.MONGODB_URI || "";
if (!mongoUrl) {
  console.error("❌ MONGODB_URI not set in .env");
  process.exit(1);
}

app.use(session({
  name: "thumblify.sid",
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl }),
  cookie: {
    httpOnly: true,
    secure: true,     // must be true on HTTPS
    sameSite: "none", // cross-origin cookie
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// ------------------- ROUTES -------------------
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);

app.get("/", (req, res) => res.send("✅ Backend running"));

// ------------------- ERROR HANDLER -------------------
app.use((err: any, req: any, res: any, next: any) => {
  console.error("💥 SERVER ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined
  });
});

// ------------------- SERVER -------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
