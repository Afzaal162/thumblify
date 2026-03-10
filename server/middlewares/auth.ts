import { Request, Response, NextFunction } from "express";

const protect = (req: Request, res: Response, next: NextFunction) => {
  const session = req.session as any; // cast to any for custom properties

  if (!session.isLoggedIn || !session.userId) {
    return res.status(401).json({ message: "You are not logged in" });
  }

  next();
};

export default protect;
