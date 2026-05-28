import mongoose from "mongoose";

const comboItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 0 },
});

const comboSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    items: [comboItemSchema],
    price: { type: Number, default: 0 }, // Tổng giá vốn hoặc giá bán combo tùy mục đích
  },
  { timestamps: true }
);

export default mongoose.model("Combo", comboSchema);
