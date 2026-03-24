import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      required: true,
      default: "Khác",
    },
    unit: { type: String, required: true }, // kg, lít, cái, túi...
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 0, min: 0 },
    minStock: { type: Number, default: 0 }, // cảnh báo tồn kho tối thiểu
    description: { type: String },
    supplier: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
