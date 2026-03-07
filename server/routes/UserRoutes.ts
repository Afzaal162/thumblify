import express from 'express';
import { getThumbnailbyId,getUserThumbnail } from '../controllers/UserController.js';
import protect from '../middlewares/auth.js';
const userRouter = express.Router();
userRouter.get('/thumbnails', protect, getUserThumbnail);
userRouter.get('/thumbnails/:id', protect, getThumbnailbyId);
export default userRouter;