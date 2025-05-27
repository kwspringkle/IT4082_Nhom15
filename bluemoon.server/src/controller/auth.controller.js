import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../model/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '5d';

// Đăng ký
export const register = async (req, res) => {
  const { fullname, username, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      username,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: 'Đăng ký thành công, chờ xét duyệt' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    if (user.status !== 'Hoạt động') {
      return res.status(403).json({ message: 'Tài khoản chưa được kích hoạt hoặc đã bị vô hiệu hóa' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie('token', token, { httpOnly: true });
    return res.json({ message: 'Đăng nhập thành công', token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Đăng xuất
export const logout = (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Đăng xuất thành công' });
};
