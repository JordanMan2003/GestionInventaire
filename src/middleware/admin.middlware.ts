import { Request, Response, NextFunction } from "express";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  if (!user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Accès refusé. Droits administrateur requis." });
  }

  next();
};
