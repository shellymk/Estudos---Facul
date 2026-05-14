import { Request, Response } from "express";
import { createUser, loginUser, googleLoginWithCode } from "../services/userService";
import { AuthRequest } from "../middlewares/authmiddleware";
import { User } from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);
    return res.json(result);
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  console.log("🔥 Callback recebido!", req.query);
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).json({ message: "code não informado" });

    const { user, token } = await googleLoginWithCode(code);
    console.log("✅ User e token gerados!", { user, token });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const userJson = encodeURIComponent(JSON.stringify(user));
    const encodedToken = encodeURIComponent(token);
    const redirectUrl = `${frontendUrl}/#token=${encodedToken}&user=${userJson}`;
    console.log("🚀 Redirecionando para:", redirectUrl);

    return res.redirect(redirectUrl);
  } catch (error: any) {
    console.error("Erro no callback Google:", error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl}/#error=${encodeURIComponent(error.message)}`);
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};