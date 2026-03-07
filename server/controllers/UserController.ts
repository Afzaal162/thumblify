import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";

// Controllers to get ALL User Thumbnail
export const getUserThumbnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;

    if (!userId) {
      return res.json({ thumbnail: [] });
    }

    const thumbnail = await Thumbnail.find({ userId }).sort({ createdAt: -1 });

    res.json({ thumbnail: thumbnail || [] });

  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// controller to get single thumbnail for user
export const getThumbnailbyId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const thumbnail = await Thumbnail.findById(id);

    if (!thumbnail) {
      return res.status(404).json({ message: "Thumbnail not found" });
    }

    res.json(thumbnail);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};