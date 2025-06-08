import mongoose from 'mongoose';
import { attachHistoryLogging } from '../middleware/history.middleware.js';

const householdSchema = new mongoose.Schema({
  apartment: {
    type: String,
    required: true,
    unique: true,
  },
  floor: {
    type: Number,
    default: 1
  },
  area: {
    type: Number,
    default: 0
  },
  head: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: ""
  },
  members: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
});

// ✅ Gắn middleware ghi lại thay đổi
attachHistoryLogging(householdSchema, 'Household');

const Household = mongoose.model('Household', householdSchema);
export default Household;
