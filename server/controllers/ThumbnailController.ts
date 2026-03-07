import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import { GoogleGenAI, GenerateContentConfig } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const AI_MODELS = [
  "models/gemini-3-pro-image-preview",
  "models/nano-banana-pro-preview",
  "models/gemini-3.1-flash-image-preview"
];

const MAX_RETRIES = 3;
const RETRY_DELAY = 3000; // 3 seconds

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
        console.log("req.body:", req.body);
    console.log("req.session.userId:", (req.session as any).userId);

    const { userId } = req.session as any;
    if (!userId) return res.status(401).json({ message: "User not logged in" });

    const { title, prompt: user_prompt, style, aspect_ratio, color_scheme, text_overlay } = req.body;

    // 1️⃣ Create DB record first
    const thumbnail = await Thumbnail.create({
      userId,
      title,
      prompt_used: user_prompt,
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      isGenerating: true
    });

    // 2️⃣ Respond immediately
    res.json({
      message: "Thumbnail generation started",
      thumbnailId: thumbnail._id
    });

    // 3️⃣ Start background processing
    (async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const generationConfig: GenerateContentConfig = {
        responseModalities: ["image"],
        imageConfig: { aspectRatio: aspect_ratio || "16:9" }
      };

      let imageBuffer: Buffer | null = null;

      for (let model of AI_MODELS) {
        let attempt = 0;
        while (attempt < MAX_RETRIES) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents: [`Create a professional YouTube thumbnail for ${title}. ${user_prompt}`],
              config: generationConfig
            });

            const parts = response.candidates[0].content.parts;
            if (!parts?.[0]?.inlineData?.data) throw new Error("No image data received");

            imageBuffer = Buffer.from(parts[0].inlineData.data, "base64");
            break; // success
          } catch (error: any) {
            attempt++;
            if (attempt >= MAX_RETRIES) {
              console.warn(`Model ${model} failed after ${MAX_RETRIES} retries.`);
            } else {
              console.log(`AI busy on ${model}, retrying in ${RETRY_DELAY}ms... (${attempt}/${MAX_RETRIES})`);
              await new Promise(r => setTimeout(r, RETRY_DELAY));
            }
          }
        }
        if (imageBuffer) break;
      }

      if (!imageBuffer) {
        thumbnail.isGenerating = false;
        await thumbnail.save();
        console.error("All AI models failed. Thumbnail not generated.");
        return;
      }

      // Upload to Cloudinary
      try {
        const uploadResult = await cloudinary.uploader.upload(
          `data:image/png;base64,${imageBuffer.toString("base64")}`,
          { resource_type: "image" }
        );

        thumbnail.image_url = uploadResult.secure_url;
        thumbnail.isGenerating = false;
        await thumbnail.save();
        console.log(`Thumbnail uploaded: ${uploadResult.secure_url}`);
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        thumbnail.isGenerating = false;
        await thumbnail.save();
      }
    })();

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// 2️⃣ Fetch Thumbnail by ID
export const getThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.session as any;

    const thumbnail = await Thumbnail.findOne({ _id: id, userId });

    if (!thumbnail) {
      return res.status(404).json({ message: "Thumbnail not found" });
    }

    res.json(thumbnail);

  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const getUserThumbnails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session as any;

    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const thumbnails = await Thumbnail.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      thumbnails
    });

  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// Delete Thumbnail controller
export const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.session as any;
    await Thumbnail.findOneAndDelete({ _id: id, userId });
    res.json({ message: 'Thumbnail has been deleted successfully' });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
