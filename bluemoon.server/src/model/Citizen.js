import mongoose from 'mongoose';

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
  apartment: {
    type: String,
    required: true,
  },
  relation: {
    type: String,
    required: true,
  },
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true,
  }
}, {
  timestamps: true
});

const Citizen = mongoose.model('Citizen', citizenSchema);
export default Citizen;
