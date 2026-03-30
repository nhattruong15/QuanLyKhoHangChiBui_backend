import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import warehouseRouter from "./routes/warehouseRouter.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

import customerRoutes from "./routes/customerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    // credentials: true,
  })
);
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/quanlykho_chibui";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// ─── Routes ──────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "QuanLyKho API đang chạy 🚀", version: "1.0.0" });
});

// Public route — no token required
app.use("/api/auth", authRoutes);

// Protected routes — JWT required
app.use("/api/products", protect, productRoutes);
app.use("/api/warehouse", protect, warehouseRouter);
app.use("/api/categories", protect, categoryRoutes);
app.use("/api/orders", protect, orderRoutes);
app.use("/api/customers", protect, customerRoutes);
app.use("/api/appointments", protect, appointmentRoutes);

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server chạy tại http://localhost:${PORT}`);
});