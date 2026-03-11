import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import connectDB from "./config/db.js";
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from "./routes/ThumbnailRoutes.js";

const app = express();

// Connect to MongoDB
connectDB().catch(console.error);

// Parse JSON
app.use(express.json());

// ===== CORS =====
const allowedOrigins = [
  "http://localhost:5173",
  "https://thumblify-frontend-pi.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: origin ${origin} not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// ===== Sessions =====
app.set("trust proxy", 1); // trust first proxy if behind Vercel / Cloudflare
app.use(session({
  name: "thumblify.sid",
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI as string,
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true on Vercel, false locally
    sameSite: "none", // required for cross-site cookies
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

// ===== Routes =====
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);

app.get("/", (req, res) => res.send("Backend running"));

export default app;
