import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  householdId: {
    type: mongoose.Schema.Types.ObjectId, // Nếu liên kết với collection household
    ref: 'Household',
    required: true
  },
  feeId: {
    type: mongoose.Schema.Types.ObjectId, // Nếu liên kết với collection fee
    ref: 'Fee',
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["PAID", "PARTIAL", "UNPAID"],
    required: true
  },
  paidDate: {
    type: Date,
    default: null
  },
  paidAmount: {
    type: String,
    default: "0"
  },
  note: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  updatedAt: {
    type: Date,
    default: () => new Date()
  }
});

// Auto-update `updatedAt`
paymentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
