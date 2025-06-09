import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: function () {
      return !this.ratePerSqm; //Bắt buộc nếu như không có phí theo mét vuông
    },
    min: [0, 'Số tiền cố định không được âm'],
  },
  ratePerSqm: {
    type: Number,
    required: function () {
      return !this.amount; //Bắt buộc nếu như không có phí chung
    },
    min: [0, 'Đơn giá theo m² không được âm'],
  },

  type: {
    type: String,
    enum: ['MONTHLY', 'YEARLY', 'OTHER'], //Thêm other cho các khoản phí k lặp lại
    required: true,
  },
  deadline:{
    type: Date
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
