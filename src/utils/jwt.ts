import jwt, { JwtPayload } from "jsonwebtoken";
import { User, UserPayload } from "../types/user.types";

export const generateToken = (user: UserPayload): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  // IMPORTANT: on met l'id dans le token
  const payload: UserPayload = {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

export const verifyToken = (token: string): UserPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const decoded = jwt.verify(token, secret);

  // jwt.verify peut retourner string | JwtPayload -> on refuse le string
  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  const payload = decoded as JwtPayload;

  // Validation minimale pour éviter undefined
  if (
    typeof payload.id !== "string" ||
    typeof payload.username !== "string" ||
    typeof payload.isAdmin !== "boolean"
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    id: payload.id,
    username: payload.username,
    isAdmin: payload.isAdmin,
  };
};
