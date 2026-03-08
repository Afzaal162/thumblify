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
const allowedOrigins = [
  "https://thumblify-frontend-pi.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman/server requests
    if (allowedOrigins.includes(origin)) return callback(null, true); // allow listed origins
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // allow cookies
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

// Dynamic preflight handler for all routes
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }
  res.sendStatus(200);
});

/* ------------- TRUST PROXY ------------- */
app.set("trust proxy", 1); // required for secure cookies on Vercel

/* ------------- SESSION SETUP ----------- */
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    httpOnly: true,
    secure: true,     // required for HTTPS
    sameSite: "none", // cross-origin cookie
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

/* --------------- ROUTES ---------------- */
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);

app.get("/", (req, res) => res.send("Backend running"));

/* ------------ ERROR HANDLER ------------ */
app.use((err, req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }
  res.status(err.status || 500).json({ message: err.message });
});

/* -------------- SERVER ---------------- */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
