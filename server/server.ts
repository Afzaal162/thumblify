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
  origin: true, // allows any requesting origin
  credentials: true
}));

/* ------------- TRUST PROXY ------------- */

app.set("trust proxy", 1);

/* ------------- SESSION SETUP ----------- */

app.use(session({
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

/* --------------- ROUTES ---------------- */

app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);

app.get("/", (req, res) => {
  res.send("Backend running");
});

/* ------------ ERROR HANDLER ------------ */

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  });
});

/* -------------- SERVER ---------------- */

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server running");
});
