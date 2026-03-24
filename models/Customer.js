import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
