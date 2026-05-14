import express from "express";
import "dotenv/config";
import cors from "cors";

import { connectDB } from "./src/database/connection";
import userRoutes from "./src/routes/userRoutes";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`📩 ${req.method} ${req.url}`);
  next();
});

app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API rodando 🚀" });
});

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
};

startServer();
