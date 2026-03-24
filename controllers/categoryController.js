import Category from "../models/Category.js";

// GET all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST create category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if exists
    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Danh mục đã tồn tại" });
    }

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({ success: true, data: category, message: "Tạo danh mục thành công" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT update category
export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: req.params.id }
    });
    
    if (existing) {
      return res.status(400).json({ success: false, message: "Tên danh mục đã tồn tại" });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });

    res.json({ success: true, data: category, message: "Cập nhật danh mục thành công" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });

    // Note: We don't automatically delete products associated with this category here
    // as category is stored as just a string in the Product schema, 
    // replacing the category would be a manual update process or handled by UI warning.

    await category.deleteOne();
    res.json({ success: true, message: "Xóa danh mục thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
