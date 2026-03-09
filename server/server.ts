import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import connectDB from "./config/db.js";
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from "./routes/ThumbnailRoutes.js";

await connectDB();

const app = express();

app.use(express.json());

/* ---------------- CORS ---------------- */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://thumblify-frontend-pi.vercel.app"
  ],
  credentials: true
}));

/* ------------- TRUST PROXY ------------- */

app.set("trust proxy", 1);

/* ------------- SESSION ----------------- */

app.use(session({
  name: "thumblify.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),

  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);

app.get("/", (req, res) => {
  res.send("Backend running");
});

/* ------------ ERROR HANDLER ------------ */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message
  });
});

/* -------------- SERVER ---------------- */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
