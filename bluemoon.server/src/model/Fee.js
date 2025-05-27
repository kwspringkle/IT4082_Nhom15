import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['MONTHLY', 'YEARLY'],
    required: true,
  },
  description: {
    type: String,
  },
  mandatory: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true // tự động thêm createdAt và updatedAt
});

const Fee = mongoose.model('Fee', feeSchema);
export default Fee;
