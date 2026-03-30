import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// Get appointments by date or month
router.get("/", async (req, res) => {
  try {
    const { date, month } = req.query;
    let query = {};
    if (date) {
      query.date = date; // YYYY-MM-DD
    } else if (month) {
      query.date = { $regex: `^${month}` }; // Matches YYYY-MM
    }
    
    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create a new appointment note
router.post("/", async (req, res) => {
  try {
    const { date, note } = req.body;
    if (!date || !note) {
      return res.status(400).json({ success: false, message: "Vui lòng cung cấp ngày và ghi chú!" });
    }

    const appointment = new Appointment({ date, note });
    const savedAppointment = await appointment.save();

    res.status(201).json({ success: true, data: savedAppointment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete an appointment note
router.delete("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Không tìm thấy ghi chú!" });
    }

    await appointment.deleteOne();
    res.json({ success: true, message: "Xóa ghi chú thành công!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
