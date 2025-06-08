import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Household",
    required: true,
  },
  feeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fee",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["PAID", "PARTIAL", "UNPAID"],
    default: "PAID",
  },
  paidDate: {
    type: Date,
    default: null,
  },
  note: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

// Auto-update `updatedAt`
paymentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
