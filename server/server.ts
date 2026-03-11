import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import connectDB from "./config/db.js";
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from "./routes/ThumbnailRoutes.js";

const app = express();

// ===== Connect to MongoDB =====
connectDB().catch(console.error);

// ===== CORS Setup =====
const allowedOrigins = [
  "http://localhost:5173",
  "https://thumblify-frontend-pi.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl, Postman, mobile apps
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("CORS not allowed by server"));
  },
  credentials: true, // important for cookies
}));

// ===== JSON Parser =====
app.use(express.json());

// ===== Session Setup =====
app.set("trust proxy", 1); // needed for Vercel / HTTPS

app.use(session({
  name: "thumblify.sid",
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI as string
  }),
  cookie: {
    httpOnly: true,
    secure: true, // must be true on HTTPS
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// ===== Routes =====
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);

app.get("/", (req, res) => res.send("Backend running"));

export default app;
