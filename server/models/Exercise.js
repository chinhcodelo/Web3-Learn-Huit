const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question_content: { type: String, required: true },
  options: { type: [String], required: true }, // 4 đáp án
  correct_option_index: { type: Number, required: true }
});

const ExerciseSchema = new mongoose.Schema({
  creator_address: { type: String, required: true, lowercase: true },
  title: { type: String, required: true }, // Tên bài thi (VD: IELTS Reading Test 1)
  topic: { type: String, required: true },
  
  // Mảng chứa nhiều câu hỏi
  questions: { 
    type: [QuestionSchema], 
    validate: [v => v.length > 0 && v.length <= 20, 'Bài thi phải có từ 1 đến 20 câu hỏi']
  },

  price: { type: Number, default: 0.0001 }, // Giá bán cho người học (ETH)
  
  ipfs_hash: { type: String },
  status: { type: String, default: 'active' },
  ai_validation: {
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reason: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Exercise', ExerciseSchema);