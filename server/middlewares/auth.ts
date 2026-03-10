import { Request, Response, NextFunction } from "express";

const protect = (req: Request, res: Response, next: NextFunction) => {
  const session = req.session as any;

  if (!session || !session.user) {
    return res.status(401).json({ message: "Not Authenticated" });
  }

  next();
};

export default protect;
