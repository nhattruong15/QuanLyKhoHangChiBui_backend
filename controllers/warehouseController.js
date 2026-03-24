import Import from "../models/Import.js";
import Export from "../models/Export.js";
import Product from "../models/Product.js";

// ─── IMPORT ─────────────────────────────────────────────

// GET all imports
export const getImports = async (req, res) => {
  try {
    const imports = await Import.find()
      .populate("items.product", "name code unit")
      .sort({ importDate: -1 });
    res.json({ success: true, data: imports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single import
export const getImportById = async (req, res) => {
  try {
    const imp = await Import.findById(req.params.id).populate("items.product");
    if (!imp) return res.status(404).json({ success: false, message: "Không tìm thấy phiếu nhập" });
    res.json({ success: true, data: imp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST create import → cập nhật tồn kho
export const createImport = async (req, res) => {
  try {
    // Tạo mã phiếu tự động
    const count = await Import.countDocuments();
    const code = `PN${String(count + 1).padStart(4, "0")}`;

    const importDoc = new Import({ ...req.body, code });
    await importDoc.save();

    // Cập nhật tồn kho sản phẩm
    for (const item of importDoc.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: item.quantity },
      });
    }

    const populated = await Import.findById(importDoc._id).populate("items.product", "name code unit");
    res.status(201).json({ success: true, data: populated, message: "Tạo phiếu nhập thành công" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE import → hoàn tồn kho
export const deleteImport = async (req, res) => {
  try {
    const imp = await Import.findById(req.params.id);
    if (!imp) return res.status(404).json({ success: false, message: "Không tìm thấy phiếu nhập" });

    // Hoàn lại tồn kho
    for (const item of imp.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }
    await imp.deleteOne();
    res.json({ success: true, message: "Xóa phiếu nhập thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── EXPORT ─────────────────────────────────────────────

// GET all exports
export const getExports = async (req, res) => {
  try {
    const exports = await Export.find()
      .populate("items.product", "name code unit")
      .sort({ exportDate: -1 });
    res.json({ success: true, data: exports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single export
export const getExportById = async (req, res) => {
  try {
    const exp = await Export.findById(req.params.id).populate("items.product");
    if (!exp) return res.status(404).json({ success: false, message: "Không tìm thấy phiếu xuất" });
    res.json({ success: true, data: exp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST create export → trừ tồn kho
export const createExport = async (req, res) => {
  try {
    // Kiểm tra tồn kho đủ không
    for (const item of req.body.items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Sản phẩm không tồn tại` });
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm "${product.name}" không đủ tồn kho (còn ${product.quantity} ${product.unit})`,
        });
      }
    }

    const count = await Export.countDocuments();
    const code = `PX${String(count + 1).padStart(4, "0")}`;

    const exportDoc = new Export({ ...req.body, code });
    await exportDoc.save();

    // Trừ tồn kho
    for (const item of exportDoc.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }

    const populated = await Export.findById(exportDoc._id).populate("items.product", "name code unit");
    res.status(201).json({ success: true, data: populated, message: "Tạo phiếu xuất thành công" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE export → hoàn tồn kho
export const deleteExport = async (req, res) => {
  try {
    const exp = await Export.findById(req.params.id);
    if (!exp) return res.status(404).json({ success: false, message: "Không tìm thấy phiếu xuất" });

    for (const item of exp.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: item.quantity },
      });
    }
    await exp.deleteOne();
    res.json({ success: true, message: "Xóa phiếu xuất thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DASHBOARD STATS ─────────────────────────────────────

export const getStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({
      $expr: { $lte: ["$quantity", "$minStock"] },
    });
    const totalImports = await Import.countDocuments();
    const totalExports = await Export.countDocuments();

    // Tổng giá trị kho
    const inventoryValue = await Product.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ["$quantity", "$price"] } } } },
    ]);

    // Nhập xuất 7 ngày gần nhất
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentImports = await Import.aggregate([
      { $match: { importDate: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%d/%m", date: "$importDate" } },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const recentExports = await Export.aggregate([
      { $match: { exportDate: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%d/%m", date: "$exportDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top sản phẩm tồn kho thấp
    const lowStockList = await Product.find({
      $expr: { $lte: ["$quantity", "$minStock"] },
    })
      .select("name code quantity minStock unit")
      .limit(5);

    // Phân bố theo danh mục
    const categoryStats = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, totalValue: { $sum: { $multiply: ["$quantity", "$price"] } } } },
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStockProducts,
        totalImports,
        totalExports,
        inventoryValue: inventoryValue[0]?.total || 0,
        recentImports,
        recentExports,
        lowStockList,
        categoryStats,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
