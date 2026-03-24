import Customer from "../models/Customer.js";

// GET all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });
    res.json({ success: true, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single customer
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ success: false, message: "Không tìm thấy khách hàng" });
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST create customer
export const createCustomer = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Tên khách hàng là bắt buộc" });
    const customer = new Customer({ name, address, phone });
    await customer.save();
    res.status(201).json({ success: true, data: customer, message: "Thêm khách hàng thành công" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT update customer
export const updateCustomer = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, address, phone },
      { new: true, runValidators: true }
    );
    if (!customer)
      return res.status(404).json({ success: false, message: "Không tìm thấy khách hàng" });
    res.json({ success: true, data: customer, message: "Cập nhật khách hàng thành công" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ success: false, message: "Không tìm thấy khách hàng" });
    await customer.deleteOne();
    res.json({ success: true, message: "Xóa khách hàng thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
