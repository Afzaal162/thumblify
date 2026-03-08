import "dotenv/config";
import express from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from './routes/ThumbnailRoutes.js';

await connectDB();

const app = express();

// 1️⃣ JSON parser
app.use(express.json());

// 2️⃣ CORS config for frontend
const allowedOrigins = [
  "http://localhost:5173", // React dev server
  "https://thumblify-frontend-pi.vercel.app" // Deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: The origin ${origin} is not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// 3️⃣ Session config
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000*60*60*24*7, // 7 days
    sameSite: 'lax',          // allow cross-origin
    secure: false             // http only
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI as string,
    collectionName: 'sessions'
  })
}));

// Routes
app.use('/api/auth', AuthRouter);
app.use('/api/thumbnail', ThumbnailRouter);
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
