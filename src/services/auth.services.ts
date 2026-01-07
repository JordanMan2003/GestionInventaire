import { AuthRepository } from "../repositories/auth.repositories";
import bcrypt from "bcrypt";
import { LoginUserRequest, RegisterUserRequest } from "../types/user.types";
import { randomUUID } from "node:crypto";
import { generateToken } from "../utils/jwt";

const authRepository = new AuthRepository();

export class AuthService {
  async register(registerData: RegisterUserRequest) {
    validateRegisterData(registerData.username, registerData.password);

    const existingUser = await authRepository.findByUsername(
      registerData.username
    );
    if (existingUser) {
      throw new Error("Nom d'utilisateur déjà utilisé");
    }

    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    const userId = randomUUID();

    const newUser = await authRepository.create({
      id: userId,
      username: registerData.username,
      passwordHash: hashedPassword,
    });
    const token = generateToken(newUser);
    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        isAdmin: newUser.isAdmin,
      },
      token,
    };
  }

  async login(loginUser: LoginUserRequest) {
    validateLoginData(loginUser.username, loginUser.password);

    const user = await authRepository.findByUsername(loginUser.username);
    if (!user) {
      throw new Error("Nom d'utilisateur ou mot de passe incorrect");
    }

    const isPasswordValid = await bcrypt.compare(
      loginUser.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new Error("Nom d'utilisateur ou mot de passe incorrect");
    }

    const token = generateToken(user);
    return {
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      token,
    };
  }

  async getUserById(id: string) {
    const user = await authRepository.findById(id);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
  }

  async getUserByUsername(username: string) {
    const user = await authRepository.findByUsername(username);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
  }
}
const validateRegisterData = (username: string, password: string) => {
  if (!username || !password) {
    throw new Error("Username et password requis");
  }

  if (username.length < 2 || username.length > 50) {
    throw new Error("Username doit avoir entre 2 et 50 caractères");
  }

  if (password.length < 6) {
    throw new Error("Password doit avoir au moins 6 caractères");
  }
};

const validateLoginData = (username: string, password: string) => {
  if (!username || !password) {
    throw new Error("Username et password requis");
  }
};
