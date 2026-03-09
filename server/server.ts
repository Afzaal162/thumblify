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

/* ---------------- MIDDLEWARE ---------------- */

app.use(express.json());

/* ---------------- CORS ---------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "https://thumblify-frontend-pi.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

/* ------------- TRUST PROXY ------------- */

app.set("trust proxy", 1);

/* ------------- SESSION SETUP ----------- */

app.use(
  session({
    name: "thumblify.sid",
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions"
    }),

    cookie: {
      httpOnly: true,
      secure: true,      // required for HTTPS (Vercel)
      sameSite: "none",  // allow cross-origin cookies
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  })
);

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);

app.get("/", (req, res) => {
  res.send("Thumblify backend running");
});

/* ------------ ERROR HANDLER ------------ */

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

/* -------------- SERVER ---------------- */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
