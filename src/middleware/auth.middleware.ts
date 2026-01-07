import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../types/user.types";
import { verifyToken } from "../utils/jwt";

//Aider par l'IA
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.authToken;
    console.log("Token reçu:", token);

    if (!token) {
      console.log("Pas de token");
      return res.status(401).json({ message: "Token manquant" });
    }

    const payload = verifyToken(token);
    console.log("Payload décodé:", payload);
    req.user = payload;
    next();
  } catch (error) {
    console.log("Erreur de décodage:", error);
    return res.status(401).json({ message: "Token invalide" });
  }
};
