import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  collectionName: String,         // Ví dụ: 'Household'
  documentId: mongoose.Schema.Types.ObjectId,  // ID của document bị sửa
  operation: String,              // 'update' | 'delete'
  modifiedBy: String,             // userId
  changes: mongoose.Schema.Types.Mixed, // các trường bị thay đổi
  createdAt: { type: Date, default: Date.now }
});

const History = mongoose.model('History', historySchema);
export default History;
