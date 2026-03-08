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
  "http://localhost:5173" // local dev
];

app.use(cors({
  origin: function(origin, callback) {
    // allow non-browser requests like Postman
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests for all routes
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

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
    secure: true,     // must be HTTPS
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
  res.status(err.status || 500).json({ message: err.message });
});

/* -------------- SERVER ---------------- */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
