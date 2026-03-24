import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    orderDate: { type: Date, required: true },
    items: [orderItemSchema],
    note: { type: String },
    status: {
      type: String,
      enum: ["Đã nhận", "Đã xuất", "Hủy"],
      default: "Đã nhận",
    },
    createdBy: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
