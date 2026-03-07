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
app.use(cors({
  origin: "http://localhost:5173", // React dev server
  credentials: true                // allow cookies
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
app.get("/hello", (req, res) => {
  res.send("Hello from backend!");
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
