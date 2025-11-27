const mongoose = require('mongoose');

const UserWeb3Schema = new mongoose.Schema({
  wallet_address: { type: String, required: true, unique: true, lowercase: true },
  balance: { type: Number, default: 0 }, // Số dư nội bộ (nếu không dùng token thật)
  reputation_score: { type: Number, default: 50 }, // Điểm uy tín
  total_correct: { type: Number, default: 0 },
  total_wrong: { type: Number, default: 0 },
  role: { type: String, default: 'learner' }, // learner, creator
  last_active: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserWeb3', UserWeb3Schema);