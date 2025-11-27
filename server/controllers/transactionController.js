const Transaction = require('../models/Transaction');
const Exercise = require('../models/Exercise');
const { ethers } = require('ethers');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
const backendWallet = new ethers.Wallet(process.env.BACKEND_ISSUER_PRIVATE_KEY, provider);

exports.logTransaction = async (req, res) => {
    try {
        const { user_address, type, amount, description, tx_hash } = req.body;
        
        console.log(`📝 Log Transaction: ${type} | Amount: ${amount}`);

        // 1. Lưu log cho người thực hiện (VD: Người mua, Người đăng bài)
        await Transaction.create({
            learner_address: user_address,
            type: type,
            amount: parseFloat(amount),
            description: description,
            tx_hash: tx_hash
        });

        // 2. LOGIC MỚI: Nếu là "Mua bài thi", cần cộng tiền log cho Tác giả
        if (type === 'BUY_EXERCISE') {
            // Trích xuất Tên bài thi từ description để tìm Creator (Hoặc tốt nhất Frontend nên gửi exercise_id)
            // Tuy nhiên, để đơn giản và không sửa Frontend, ta sẽ tìm Creator dựa trên tx_hash (nếu lưu) hoặc logic sau:
            
            // Cách tốt nhất: Frontend gửi thêm `exercise_id` hoặc `creator_address` lên.
            // Nhưng nếu bạn không muốn sửa Frontend, tôi sẽ dùng mẹo tìm bài thi dựa trên description
            // Description format: "Mua bài thi: [Title]"
            
            const title = description.replace("Mua bài thi: ", "");
            const exercise = await Exercise.findOne({ title: title });

            if (exercise) {
                console.log(`💰 Ghi nhận doanh thu cho Creator: ${exercise.creator_address}`);
                
                // Tạo log cho Creator
                await Transaction.create({
                    learner_address: exercise.creator_address, // Lưu vào lịch sử của Creator
                    type: 'SELL_EXERCISE', // Loại giao dịch mới: Bán bài
                    amount: Math.abs(parseFloat(amount)), // Số tiền dương (+)
                    description: `Bán bài thi: ${title} (Người mua: ${user_address.slice(0,6)}...)`,
                    tx_hash: tx_hash,
                    exercise_id: exercise._id
                });
            }
        }

        res.json({ success: true });
    } catch (e) {
        console.error("Log Error:", e);
        res.status(500).json({ error: e.message });
    }
};

// 2. API Nộp bài & Chấm điểm (Giữ nguyên logic cũ, chỉ đảm bảo lưu amount)
exports.submitAnswer = async (req, res) => {
    const { exercise_id, learner_address, selected_option_index, stake_tx_hash } = req.body;

    try {
        const exercise = await Exercise.findById(exercise_id);
        if (!exercise) return res.status(404).json({ error: 'Bài tập không tồn tại' });

        const isCorrect = (selected_option_index === exercise.correct_option_index);
        let rewardTxHash = null;
        let message = '';
        let amountLog = 0; // Biến lưu số tiền biến động

        if (isCorrect) {
            try {
                // Thưởng 0.0002 ETH
                const rewardAmount = ethers.parseEther("0.0002"); 
                const tx = await backendWallet.sendTransaction({
                    to: learner_address,
                    value: rewardAmount
                });
                rewardTxHash = tx.hash;
                message = `Chính xác! Đang gửi +0.0002 ETH...`;
                amountLog = 0.0002;
            } catch (txError) {
                console.error("Lỗi gửi thưởng:", txError);
                message = "Đúng! Nhưng ví hệ thống lỗi.";
            }
        } else {
            message = 'Sai rồi! Mất phí cược.';
            amountLog = -0.0001; // Ghi nhận mất tiền cược (đã trả trước đó)
        }

        // Lưu log
        await Transaction.create({
            exercise_id,
            learner_address,
            type: isCorrect ? 'REWARD' : 'STAKE_LOSS',
            amount: amountLog,
            tx_hash: rewardTxHash || stake_tx_hash,
            is_correct: isCorrect
        });

        res.json({ success: true, is_correct: isCorrect, message, stake_tx_hash, reward_tx_hash: rewardTxHash });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. API Lấy lịch sử
exports.getUserHistory = async (req, res) => {
    const { address } = req.params;
    const history = await Transaction.find({ learner_address: address })
        .populate('exercise_id', 'title') // Populate lấy tên bài tập
        .sort({ timestamp: -1 });
    res.json(history);
};
// ... (Giữ nguyên các hàm cũ) ...

// THÊM HÀM NÀY VÀO CUỐI FILE transactionController.js
exports.submitExam = async (req, res) => {
    const { user_address, exercise_id, score, total, tx_hash_fee } = req.body;

    try {
        console.log(`📝 User ${user_address} nộp bài. Điểm: ${score}/${total}`);

        // Logic trả thưởng: Nếu đúng trên 50% số câu -> Thưởng
        const passRate = (score / total);
        let rewardTxHash = null;
        let amountLog = 0;
        let message = "";

        if (passRate >= 0.5) {
            // --- THẮNG: GỬI THƯỞNG ---
            try {
                // Kiểm tra số dư ví Backend trước
                const balance = await provider.getBalance(backendWallet.address);
                if (balance < ethers.parseEther("0.0005")) {
                    throw new Error("Ví hệ thống hết tiền, không thể trả thưởng!");
                }

                // Thưởng 0.0002 ETH (Ví dụ)
                const rewardAmount = ethers.parseEther("0.0002"); 
                
                const tx = await backendWallet.sendTransaction({
                    to: user_address,
                    value: rewardAmount
                });
                
                rewardTxHash = tx.hash;
                amountLog = 0.0002;
                message = "Chúc mừng! Bạn đã đậu và nhận thưởng 0.0002 ETH";
                console.log(`✅ Reward sent: ${tx.hash}`);

            } catch (err) {
                console.error("Lỗi gửi tiền:", err.message);
                message = "Bạn đậu, nhưng hệ thống đang bảo trì ví thưởng.";
            }
        } else {
            message = "Rất tiếc, bạn chưa đạt yêu cầu để nhận thưởng.";
        }

        // Lưu Log
        const Transaction = require('../models/Transaction'); // Đảm bảo import model
        await Transaction.create({
            learner_address: user_address,
            exercise_id: exercise_id,
            type: amountLog > 0 ? 'REWARD' : 'EXAM_RESULT',
            amount: amountLog,
            tx_hash: rewardTxHash || tx_hash_fee || "NO_HASH",
            description: `Kết quả thi: ${score}/${total}`,
            is_correct: passRate >= 0.5
        });

        res.json({ success: true, message, tx_hash: rewardTxHash });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};