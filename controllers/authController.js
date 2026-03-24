import jwt from "jsonwebtoken";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || "quanlykho_secret_key",
      { expiresIn: "8h" }
    );

    res.json({ success: true, token, username, message: "Đăng nhập thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
