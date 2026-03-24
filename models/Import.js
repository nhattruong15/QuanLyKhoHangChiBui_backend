import mongoose from "mongoose";

const importItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }, // giá nhập
});

const importSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    items: [importItemSchema],
    supplier: { type: String, required: true },
    note: { type: String },
    totalAmount: { type: Number, default: 0 },
    importDate: { type: Date, default: Date.now },
    createdBy: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

// Tự tính tổng tiền
importSchema.pre("save", function () {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
});

export default mongoose.model("Import", importSchema);
