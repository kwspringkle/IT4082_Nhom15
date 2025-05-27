import { users } from '../seed/fakeUsers.js';

export const getAllAccounts = (req, res) => {
  res.json(users);
};

export const getAccountById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
  res.json(user);
};

export const createAccount = (req, res) => {
  const newUser = {
    ...req.body,
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    createdAt: new Date().toISOString().split('T')[0]
  };
  users.push(newUser);
  res.status(201).json(newUser);
};

export const updateAccount = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
};

export const deleteAccount = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
  const deleted = users.splice(index, 1);
  res.json({ message: 'Đã xóa tài khoản', account: deleted[0] });
};


// PATCH /api/accounts/:id/lock
export const lockAccount = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

  user.status = 'Vô hiệu';
  res.json({ message: 'Đã khóa tài khoản', user });
};

// PATCH /api/accounts/:id/unlock
export const unlockAccount = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

  user.status = 'Hoạt động';
  res.json({ message: 'Đã mở khóa tài khoản', user });
};
