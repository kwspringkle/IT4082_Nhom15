// config/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://tuananh12072002:nJYvvOnSpxDex4nR@cluster0.uk0hdsr.mongodb.net/ktpm_db?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Đã kết nối MongoDB thành công');
  } catch (err) {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
    process.exit(1); // Dừng server nếu kết nối thất bại
  }
};
