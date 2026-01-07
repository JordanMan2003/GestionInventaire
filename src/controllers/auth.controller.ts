import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.services";
import { RegisterUserRequest, LoginUserRequest } from "../types/user.types";
import { generateToken } from "../utils/jwt";

const authService = new AuthService();
export class AuthController {
  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username, password }: RegisterUserRequest = req.body;

      if (!username || !password) {
        res.status(400).json({ message: "Username et password requis" });
        return;
      }

      const { user: createdUser, token } = await authService.register(req.body);

      // use returned token and user data
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        message: "Utilisateur créé avec succès",
        user: {
          id: createdUser.id,
          username: createdUser.username,
        },
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Nom d'utilisateur déjà utilisé") {
          res.status(409).json({ message: error.message });
          return;
        }
        res.status(400).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username, password }: LoginUserRequest = req.body;

      if (!username || !password) {
        res.status(400).json({ message: "Username et password requis" });
        return;
      }

      const { user: loggedUser, token } = await authService.login(req.body);

      // use the token returned from the service and the inner user data
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Connexion réussie",
        user: {
          id: loggedUser.id,
          username: loggedUser.username,
        },
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Nom d'utilisateur ou mot de passe incorrect") {
          res.status(401).json({ message: "Identifiants invalides" });
          return;
        }
        res.status(400).json({ message: error.message });
        return;
      }
      next(error);
    }
  };
  logout = (req: Request, res: Response): void => {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out" });
  };

  me = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Non autorisé" });
        return;
      }

      const user = await authService.getUserById(userId);

      res.json({
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Utilisateur non trouvé"
      ) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };
}
