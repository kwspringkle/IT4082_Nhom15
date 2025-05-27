import mongoose from 'mongoose';

const householdSchema = new mongoose.Schema({
  apartment: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  head: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  members: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu tới model User
    required: true,
  }
}, {
  timestamps: true
});

const Household = mongoose.model('Household', householdSchema);
export default Household;
