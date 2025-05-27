import User from '../model/User.js';

// GET /api/accounts
export const getAllAccounts = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách tài khoản', error: err.message });
  }
};

// GET /api/accounts/:id
export const getAccountById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tìm tài khoản', error: err.message });
  }
};

// POST /api/accounts
export const createAccount = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: 'Không thể tạo tài khoản', error: err.message });
  }
};

// PUT /api/accounts/:id
export const updateAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật tài khoản', error: err.message });
  }
};

// DELETE /api/accounts/:id
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    res.json({ message: 'Đã xóa tài khoản', account: user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa tài khoản', error: err.message });
  }
};

// PATCH /api/accounts/:id/lock
export const lockAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'Vô hiệu' }, { new: true });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    res.json({ message: 'Đã khóa tài khoản', user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi khóa tài khoản', error: err.message });
  }
};

// PATCH /api/accounts/:id/unlock
export const unlockAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'Hoạt động' }, { new: true });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    res.json({ message: 'Đã mở khóa tài khoản', user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi mở khóa tài khoản', error: err.message });
  }
};
