const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  // Loại thống kê (VD: 'daily_snapshot', 'realtime_cache')
  type: { 
    type: String, 
    default: 'realtime_cache',
    unique: true 
  },

  // Các chỉ số tổng quan
  metrics: {
    total_users: { type: Number, default: 0 },
    total_exercises: { type: Number, default: 0 },
    total_approved_exercises: { type: Number, default: 0 },
    total_transactions_value: { type: Number, default: 0 } // Tổng token đã giao dịch
  },

  // Bảng xếp hạng Top Creator (Cache lại top 10)
  top_creators: [{
    address: String,
    reputation: Number,
    total_earned: Number
  }],

  // Thời gian cập nhật lần cuối
  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);