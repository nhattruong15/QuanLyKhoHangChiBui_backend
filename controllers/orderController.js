import Order from "../models/Order.js";
import Product from "../models/Product.js";

// GET all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name code unit quantity")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name code unit quantity");
    if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST create order
export const createOrder = async (req, res) => {
  try {
    // Generate order code DH...
    // Robust order code generation: Find the highest existing code DHxxxx and increment it
    const lastOrder = await Order.findOne({}, { code: 1 }).sort({ code: -1 });
    let newSerialNumber = 1;
    if (lastOrder && lastOrder.code) {
      const lastNumber = parseInt(lastOrder.code.replace("DH", ""), 10);
      if (!isNaN(lastNumber)) {
        newSerialNumber = lastNumber + 1;
      }
    }
    const code = `DH${String(newSerialNumber).padStart(4, "0")}`;

    const newOrder = new Order({ ...req.body, code });
    await newOrder.save();

    const populated = await Order.findById(newOrder._id).populate("items.product", "name code unit quantity");
    res.status(201).json({ success: true, data: populated, message: "Tạo đơn hàng thành công" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });

    await order.deleteOne();
    res.json({ success: true, message: "Xóa đơn hàng thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE order (full edit)
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    if (order.status === "Đã xuất thành công") {
      return res.status(400).json({ success: false, message: "Không thể sửa đơn đã xuất thành công" });
    }

    const { customerName, orderDate, note, items, totalAmount } = req.body;
    if (customerName !== undefined) order.customerName = customerName;
    if (orderDate !== undefined) order.orderDate = orderDate;
    if (note !== undefined) order.note = note;
    if (items !== undefined) order.items = items;
    if (totalAmount !== undefined) order.totalAmount = totalAmount;

    await order.save();
    const populated = await Order.findById(order._id).populate("items.product", "name code unit quantity");
    res.json({ success: true, data: populated, message: "Cập nhật đơn hàng thành công" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE order status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate("items.product", "name code unit quantity");
    
    if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    res.json({ success: true, data: order, message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
