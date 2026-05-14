import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não informado" });
  }
  const token = auth.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as { id: string; email: string };
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};