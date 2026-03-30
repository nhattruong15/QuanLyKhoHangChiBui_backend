import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    date: { 
      type: String, 
      required: true,
      index: true
    }, // Format: YYYY-MM-DD
    note: { 
      type: String, 
      required: true 
    },
  },
  { 
    timestamps: true 
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
