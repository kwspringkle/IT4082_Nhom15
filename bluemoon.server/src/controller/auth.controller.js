import jwt from 'jsonwebtoken';
import { users } from '../seed/fakeUsers.js'; // dữ liệu giả

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '5d';

// Đăng ký
export const register = (req, res) => {
  const { username, password } = req.body;

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
  }

  // Tạo id mới (ví dụ tăng dần dựa vào length)
  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);

  res.status(201).json({ message: 'Đăng ký thành công' });
};

// Đăng nhập
export const login = (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
  }

  // Tạo token chứa id và username
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Đăng nhập thành công', token });
};

// Đăng xuất
export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Đăng xuất thành công' });
};
