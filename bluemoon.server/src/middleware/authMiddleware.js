import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Middleware xác thực JWT
export const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // gắn dữ liệu người dùng vào request
    next(); // tiếp tục xử lý request
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};
