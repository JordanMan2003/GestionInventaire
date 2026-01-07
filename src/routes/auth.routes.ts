import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

import { authMiddleware } from "../middleware/auth.middleware";

export const createAuthRoutes = (): Router => {
  const authController = new AuthController();
  const router = Router();

  router.post("/register", authController.register);
  router.post("/login", authController.login);
  router.post("/logout", authController.logout);
  router.get("/me", authMiddleware, authController.me);

  return router;
};
