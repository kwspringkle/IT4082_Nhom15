import mongoose from 'mongoose';
import { attachHistoryLogging } from '../middleware/history.middleware.js';

const citizenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  citizenId: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ['Nam', 'Nữ', 'Khác'],
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
  },
  relation: {
    type: String,
    required: true,
  },
  status : {
    type: String,
    enum: ['Thường trú', 'Tạm vắng', 'Đã chuyển đi'],
    default : 'Thường trú',
  },
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true,
  }
}, {
  timestamps: true
});

attachHistoryLogging(citizenSchema, 'Citizen');

const Citizen = mongoose.model('Citizen', citizenSchema);
export default Citizen;
