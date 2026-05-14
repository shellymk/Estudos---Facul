import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    cpf:      { type: String, required: false }, // cpf é opcional (login social não tem)
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: false, select: false }, // ✅ select: false → não vaza a senha por padrão
    authProvider: { type: String, default: "local" }, // "local" | "google"
    googleId: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);