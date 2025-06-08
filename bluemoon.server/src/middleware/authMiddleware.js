import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Middleware xác thực JWT
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
  }
  const token = authHeader.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

