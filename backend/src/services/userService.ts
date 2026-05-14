import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import https from "https";

interface UserData {
  name?: string;
  cpf?: string;
  email: string;
  password: string;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET não definido no .env");
  return secret;
};

export const createUser = async (data: UserData) => {
  const { name, cpf, email, password } = data;
  if (!email || !password) throw new Error("Email e senha são obrigatórios");
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("Usuário já existe");
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, cpf, email, password: hashedPassword });
  const { password: _, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

export const loginUser = async (data: UserData) => {
  const { email, password } = data;
  if (!email || !password) throw new Error("Email e senha são obrigatórios");
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Usuário não encontrado");
  if (!user.password) throw new Error("Erro interno: senha não encontrada");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Senha inválida");
  const secret = getJwtSecret();
  const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "1d" });
  const { password: _, ...userWithoutPassword } = user.toObject();
  return { user: userWithoutPassword, token };
};

const exchangeCodeForToken = (code: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const domain       = process.env.AUTH0_DOMAIN;
    const clientId     = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;
    const callbackUrl  = process.env.AUTH0_CALLBACK_URL;

    if (!domain || !clientId || !clientSecret || !callbackUrl) {
      return reject(new Error("Variáveis AUTH0 não configuradas no .env"));
    }

    const body = JSON.stringify({
      grant_type:    "authorization_code",
      client_id:     clientId,
      client_secret: clientSecret,
      code,
      redirect_uri:  callbackUrl,
    });

    const req = https.request(
      {
        hostname: domain,
        path:     "/oauth/token",
        method:   "POST",
        headers:  { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try { resolve(JSON.parse(data)); }
          catch { reject(new Error("Resposta inválida do Auth0")); }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
};

const fetchAuth0UserInfo = (accessToken: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const domain = process.env.AUTH0_DOMAIN;
    if (!domain) return reject(new Error("AUTH0_DOMAIN não configurado"));

    const req = https.request(
      {
        hostname: domain,
        path:     "/userinfo",
        method:   "GET",
        headers:  { Authorization: `Bearer ${accessToken}` },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try { resolve(JSON.parse(data)); }
          catch { reject(new Error("Resposta inválida do Auth0 (userinfo)")); }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
};

export const googleLoginWithCode = async (code: string) => {
  const tokenData = await exchangeCodeForToken(code);
  if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);

  const profile = await fetchAuth0UserInfo(tokenData.access_token);
  if (!profile.email) throw new Error("Não foi possível obter o e-mail do Google");

  let user = await User.findOne({ email: profile.email });
  if (!user) {
    user = await User.create({
      name:         profile.name || profile.nickname || profile.email.split("@")[0],
      email:        profile.email,
      authProvider: "google",
      googleId:     profile.sub,
    });
  }

  const secret = getJwtSecret();
  const token  = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "1d" });
  const { password: _, ...userWithoutPassword } = user.toObject();
  return { user: userWithoutPassword, token };
};
