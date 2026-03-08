import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectDB from "./config/db.js";

await connectDB();

const app = express();

// JSON parser
app.use(express.json());

// Allowed origins
const allowedOrigins = [
  "https://thumblify-frontend-pi.vercel.app"
];

// CORS middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions"
  }),
  cookie: {
    maxAge: 1000*60*60*24*7,
    sameSite: "none",
    secure: true
  }
}));

// Routes
app.use("/api/auth", AuthRouter);

// Test
app.get("/", (req, res) => res.send("Hello from backend"));

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
