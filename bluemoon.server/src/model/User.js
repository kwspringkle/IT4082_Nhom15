import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Tổ trưởng', 'Kế toán'],
    default: 'Kế toán',
  },
  status: {
    type: String,
    enum: ['Hoạt động', 'Vô hiệu', 'Chờ duyệt'],
    default: 'Chờ duyệt',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true // tự động thêm createdAt và updatedAt
});

const User = mongoose.model('User', userSchema);
export default User;
