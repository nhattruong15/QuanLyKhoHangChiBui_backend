import mongoose from "mongoose";

const exportItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const exportSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    items: [exportItemSchema],
    purpose: {
      type: String,
      required: true,
      enum: ["Bếp chính", "Bếp phụ", "Kiểm kê", "Hủy hàng", "Khác"],
      default: "Bếp chính",
    },
    note: { type: String },
    exportDate: { type: Date, default: Date.now },
    createdBy: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Export", exportSchema);
