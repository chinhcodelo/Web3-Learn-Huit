// server/controllers/dashboardController.js
const UserWeb3 = require('../models/UserWeb3'); // Lưu ý: Nếu bạn không dùng model này nữa thì có thể dùng Exercise/Transaction để đếm
const Exercise = require('../models/Exercise');
const Transaction = require('../models/Transaction');

exports.getStats = async (req, res) => {
  try {
    // Đếm tổng số bài tập
    const totalExercises = await Exercise.countDocuments();
    
    // Đếm tổng số ví duy nhất đã tham gia giao dịch (Số lượng người dùng)
    const distinctUsers = await Transaction.distinct('learner_address');
    const totalUsers = distinctUsers.length;

    // Giả lập top creator từ dữ liệu bài tập (hoặc từ Transaction)
    // Ở đây lấy danh sách người tạo bài nhiều nhất
    const topCreatorsAgg = await Exercise.aggregate([
        { "$group": { "_id": "$creator_address", "count": { "$sum": 1 } } },
        { "$sort": { "count": -1 } },
        { "$limit": 5 }
    ]);

    const topCreators = topCreatorsAgg.map(c => ({
        address: c._id,
        score: c.count * 10 // Giả sử mỗi bài tạo được 10 điểm uy tín
    }));

    res.json({
      total_users: totalUsers,
      total_exercises: totalExercises,
      top_creators: topCreators
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Lỗi lấy thống kê Dashboard" });
  }
};