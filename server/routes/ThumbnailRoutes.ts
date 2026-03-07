import express from "express";
import {
  generateThumbnail,
  deleteThumbnail,
  getThumbnail,
  getUserThumbnails
} from "../controllers/ThumbnailController.js";
import protect from "../middlewares/auth.js";

const ThumbnailRouter = express.Router();

// generate thumbnail
ThumbnailRouter.post("/generate", protect, generateThumbnail);

// get all thumbnails of logged user
ThumbnailRouter.get("/user", protect, getUserThumbnails);

// fetch single thumbnail
ThumbnailRouter.get("/:id", protect, getThumbnail);

// delete thumbnail
ThumbnailRouter.delete("/:id", protect, deleteThumbnail);

export default ThumbnailRouter;