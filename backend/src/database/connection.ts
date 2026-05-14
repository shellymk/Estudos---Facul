import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("🔴 MONGO_URI não definida no .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("🟢 Banco conectado com sucesso");
  } catch (error) {
    console.error("🔴 Erro ao conectar no banco:", error);
    process.exit(1);
  }
};
