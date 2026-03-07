import { Request, Response, NextFunction } from 'express';

const protect = (req: Request, res: Response, next: NextFunction) => {
  const { isLoggedIn, userId } = req.session as any;
  if (!isLoggedIn || !userId)
    return res.status(401).json({ message: "You are not logged in" });

  next();
};

export default protect;