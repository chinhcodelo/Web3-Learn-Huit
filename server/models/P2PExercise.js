const mongoose = require('mongoose');

const P2PExerciseSchema = new mongoose.Schema({
  // Người tạo bài tập (Ví Creator)
  creator_address: { 
    type: String, 
    required: true, 
    lowercase: true,
    ref: 'UserWeb3' // Tham chiếu sang bảng User nếu cần populate
  },

  topic: { 
    type: String, 
    enum: ['Grammar', 'Vocabulary', 'Reading', 'Listening', 'IELTS', 'TOEIC'], 
    required: true 
  },

  question_content: { 
    type: String, 
    required: true,
    minlength: 10 
  },

  // Mảng 4 đáp án trắc nghiệm
  options: { 
    type: [String], 
    required: true,
    validate: [arrayLimit, '{PATH} phải có đúng 4 lựa chọn']
  },

  // Index của đáp án đúng trong mảng options (0, 1, 2, 3)
  correct_option_index: { 
    type: Number, 
    required: true,
    min: 0,
    max: 3 
  },

  // Số Token người học phải trả nếu làm sai (Mức cược)
  stake_amount: { 
    type: Number, 
    default: 5,
    min: 1
  },

  // Phần thưởng hệ thống trả nếu làm đúng (Cấu hình cứng hoặc động)
  reward_amount: {
    type: Number,
    default: 10
  },

  // AI Moderation: Trạng thái duyệt bài tự động
  ai_validation: {
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    confidence_score: { type: Number, default: 0 }, // Độ tin cậy của AI (0.0 - 1.0)
    reason: { type: String, default: '' }, // Lý do từ chối (nếu có)
    checked_at: { type: Date }
  },

  // Lượt làm bài
  total_attempts: { type: Number, default: 0 },
  total_correct: { type: Number, default: 0 },

}, {
  timestamps: true
});

function arrayLimit(val) {
  return val.length === 4;
}

module.exports = mongoose.model('P2PExercise', P2PExerciseSchema);