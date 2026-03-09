import { Request, Response, NextFunction } from "express";

// You can also extend the session type if using express-session
interface SessionData {
  isLoggedIn?: boolean;
  userId?: string;
}

const protect = (req: Request & { session: SessionData }, res: Response, next: NextFunction) => {
  const { isLoggedIn, userId } = req.session;

  if (!isLoggedIn || !userId) {
    return res.status(401).json({
      message: "You are not logged in"
    });
  }

  next();
};

export default protect;
