// client/src/components/ExerciseCard.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { Web3Context } from '../contexts/Web3Context';

const ExerciseCard = ({ exercise }) => {
  const { currentAccount } = useContext(Web3Context);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async () => {
    if (selected === null) return alert("Vui lòng chọn đáp án!");
    if (!currentAccount) return alert("Kết nối ví để tiếp tục!");

    setLoading(true);
    setStatusMsg("🚀 Đang khởi tạo giao dịch Blockchain...");

    try {
      // --- BƯỚC 1: CHUYỂN TIỀN CƯỢC THẬT (P2P TRANSACTION) ---
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Số tiền cược: Lấy từ bài tập hoặc mặc định 0.0001 ETH
      // Lưu ý: Value phải là BigInt hoặc HexString
      const stakeAmount = ethers.parseEther("0.0001"); 

      setStatusMsg(`💸 Vui lòng chuyển 0.0001 ETH cho Creator (${exercise.creator_address.slice(0,6)}...)...`);
      
      // LỆNH QUAN TRỌNG: Chuyển tiền thật từ ví người dùng sang ví người tạo
      const tx = await signer.sendTransaction({
        to: exercise.creator_address,
        value: stakeAmount
      });

      setStatusMsg("⛓️ Đang chờ xác nhận trên Blockchain (Mining)...");
      await tx.wait(); // Bắt buộc chờ giao dịch thành công trên Blockchain

      // --- BƯỚC 2: GỬI HASH GIAO DỊCH VỀ SERVER ĐỂ CHẤM ĐIỂM ---
      setStatusMsg("📤 Đã thanh toán xong! Đang gửi bài làm...");
      
      const res = await axios.post('http://localhost:5000/api/submit-answer', {
        exercise_id: exercise._id,
        learner_address: currentAccount,
        selected_option_index: selected,
        stake_tx_hash: tx.hash // Gửi bằng chứng đã nộp tiền
      });

      setResult(res.data);
      setStatusMsg(""); 

    } catch (err) {
      console.error(err);
      if (err.code === 'ACTION_REJECTED') {
        setStatusMsg("❌ Bạn đã từ chối trả phí làm bài.");
      } else {
        setStatusMsg("❌ Lỗi: " + (err.response?.data?.error || err.message));
      }
    }
    setLoading(false);
  };

  // Logic style hiển thị đáp án (Giữ nguyên để UI đẹp)
  const getOptionStyle = (idx) => {
    if (result) {
      if (idx === exercise.correct_option_index) return "bg-emerald-500/20 border-emerald-500 text-emerald-300";
      if (idx === selected && idx !== exercise.correct_option_index) return "bg-red-500/20 border-red-500 text-red-300";
      return "opacity-30 border-transparent";
    }
    return selected === idx 
      ? "bg-indigo-600/30 border-indigo-500 text-white" 
      : "bg-white/5 border-transparent hover:bg-white/10 text-gray-300";
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-full relative group">
      {/* (Phần Header và Content giữ nguyên như cũ) */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
            {exercise.topic}
          </span>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Phí tham gia</p>
            <p className="text-red-400 font-mono font-bold text-sm">0.0001 ETH</p>
          </div>
        </div>

        <h3 className="text-lg font-medium text-white mb-6 leading-relaxed flex-grow">
          {exercise.question_content}
        </h3>

        <div className="space-y-3 mb-6">
          {exercise.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={!!result || loading}
              onClick={() => setSelected(idx)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm ${getOptionStyle(idx)}`}
            >
              <span className="font-bold mr-2 opacity-50">{['A','B','C','D'][idx]}.</span> {opt}
            </button>
          ))}
        </div>

        {/* Loading Overlay */}
        {loading && (
            <div className="absolute inset-0 bg-black/90 z-50 rounded-2xl flex flex-col items-center justify-center text-center p-4 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-indigo-300 font-bold animate-pulse text-sm">{statusMsg}</p>
            </div>
        )}

        {/* Footer Results */}
        {result ? (
          <div className={`p-4 rounded-xl text-center border animate-fade-in ${
            result.is_correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
          }`}>
            <p className={`font-bold ${result.is_correct ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.message}
            </p>
            
            <div className="flex flex-col gap-2 mt-3 text-xs">
                {/* Link xem bằng chứng cược */}
                <a href={`https://sepolia.etherscan.io/tx/${result.stake_tx_hash}`} target="_blank" rel="noreferrer" className="text-gray-400 underline hover:text-white">
                    🧾 Xem biên lai thanh toán (Stake)
                </a>
                
                {/* Link xem bằng chứng thưởng (nếu có) */}
                {result.reward_tx_hash && (
                <a href={`https://sepolia.etherscan.io/tx/${result.reward_tx_hash}`} target="_blank" rel="noreferrer" className="text-emerald-400 underline hover:text-emerald-300">
                    🎁 Xem giao dịch nhận thưởng
                </a>
                )}
            </div>
          </div>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={loading || selected === null}
            className={`w-full py-3 rounded-xl font-bold transition-all ${
              loading 
                ? 'bg-gray-700 text-gray-400 cursor-wait'
                : selected !== null 
                  ? 'btn-gradient shadow-lg hover:shadow-indigo-500/50' // Nút sáng lên khi chọn
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Đang xử lý...' : 'Trả 0.0001 ETH & Nộp bài'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;