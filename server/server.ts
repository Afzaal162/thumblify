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

// 2️⃣ Allowed origins
const allowedOrigins = [
  "https://thumblify-frontend-pi.vercel.app",
  "http://localhost:5173"
];

// 3️⃣ CORS middleware applied first
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman or server-to-server
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("Not allowed by CORS"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// 4️⃣ Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions"
  }),
  cookie: {
    maxAge: 1000*60*60*24*7, // 7 days
    sameSite: "none",         // cross-origin cookies
    secure: true              // HTTPS required
  }
}));

// 5️⃣ Routes
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);

// 6️⃣ Catch-all for errors (important for CORS on 401)
app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigins.join(","));
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(err.status || 500).json({ message: err.message });
});

// 7️⃣ Test route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
