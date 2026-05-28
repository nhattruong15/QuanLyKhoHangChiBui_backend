import Combo from "../models/Combo.js";

// GET all combos
export const getCombos = async (req, res) => {
  try {
    const combos = await Combo.find().populate("items.product", "name unit price code");
    res.json({ success: true, data: combos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single combo
export const getComboById = async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.id).populate("items.product");
    if (!combo) return res.status(404).json({ success: false, message: "Không tìm thấy combo" });
    res.json({ success: true, data: combo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST create combo
export const createCombo = async (req, res) => {
  try {
    const combo = new Combo(req.body);
    await combo.save();
    const populated = await Combo.findById(combo._id).populate("items.product", "name unit price code");
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT update combo
export const updateCombo = async (req, res) => {
  try {
    const combo = await Combo.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("items.product", "name unit price code");
    if (!combo) return res.status(404).json({ success: false, message: "Không tìm thấy combo" });
    res.json({ success: true, data: combo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE combo
export const deleteCombo = async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.id);
    if (!combo) return res.status(404).json({ success: false, message: "Không tìm thấy combo" });
    await combo.deleteOne();
    res.json({ success: true, message: "Xóa combo thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
