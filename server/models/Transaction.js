const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  learner_address: { type: String, required: true, lowercase: true }, // Người thực hiện
  
  // Loại giao dịch: Mua bài, Phí đăng, Thưởng...
  type: { type: String, required: true }, 
  
  // Số tiền (Hỗ trợ số thập phân âm/dương)
  amount: { type: Number, required: true }, 
  
  tx_hash: { type: String, required: true },
  description: { type: String }, // Mô tả thêm (VD: Tên bài thi)
  
  exercise_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  is_correct: { type: Boolean, default: true },
  
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);