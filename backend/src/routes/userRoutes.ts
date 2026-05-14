import { Router } from "express";
import { register, login, getMe, googleCallback } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authmiddleware";

const router = Router();

router.post("/register", register);
router.post("/login",    login);

// Redireciona pro Auth0 — frontend chama GET /users/auth/google
router.get("/auth/google", (req, res) => {
  const domain   = process.env.AUTH0_DOMAIN!;
  const clientId = process.env.AUTH0_CLIENT_ID!;
  const callback = process.env.AUTH0_CALLBACK_URL!;

  if (!domain || !clientId || !callback) {
    return res.status(500).json({ message: "Auth0 não configurado no .env" });
  }

  const url = `https://${domain}/authorize?response_type=code&response_mode=query&prompt=login&client_id=${clientId}&redirect_uri=${encodeURIComponent(callback)}&scope=openid%20profile%20email`;
  res.redirect(url);
});

// Auth0 redireciona aqui após login com Google
router.get("/auth/google/callback", googleCallback);

// Rota protegida
router.get("/me", authMiddleware, getMe);

export default router;
