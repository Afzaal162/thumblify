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

// 1️⃣ JSON parser
app.use(express.json());

// 2️⃣ Allowed frontend origins
const allowedOrigins = [
  "https://thumblify-frontend-pi.vercel.app",
  "http://localhost:5173" // for local dev
];

// 3️⃣ CORS middleware – applied first
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman / server-to-server
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// 4️⃣ Trust proxy (critical for secure cookies on Vercel)
app.set('trust proxy', 1);

// 5️⃣ Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions"
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: "none",                // cross-origin cookies
    secure: true                     // required for HTTPS
  }
}));

// 6️⃣ Routes
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);

// 7️⃣ Test route
app.get("/", (req, res) => res.send("Hello from backend!"));

// 8️⃣ Catch-all error handler (ensures CORS headers on errors)
app.use((err, req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  res.status(err.status || 500).json({ message: err.message });
});

// 9️⃣ Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
