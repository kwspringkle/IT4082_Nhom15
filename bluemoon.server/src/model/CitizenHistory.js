import mongoose from 'mongoose';

const citizenHistorySchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true
  },
  changeType: {
    type: String,
    enum: ['UPDATE_INFO', 'TEMPORARY_ABSENT', 'TEMPORARY_RESIDENCE', 'DELETE', 'OTHER'],
    required: true
  },
  oldData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  newData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  changedAt: {
    type: Date,
    required: true
  },
  changedBy: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const CitizenHistory = mongoose.model('CitizenHistory', citizenHistorySchema);
export default CitizenHistory;
