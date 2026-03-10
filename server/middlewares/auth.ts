import { Request, Response, NextFunction } from "express";

interface SessionData {
  isLoggedIn?: boolean;
  userId?: string;
}

const protect = (req: Request & { session: SessionData }, res: Response, next: NextFunction) => {
  if (!req.session.isLoggedIn || !req.session.userId) {
    return res.status(401).json({ message: "You are not logged in" });
  }
  next();
};

export default protect;
