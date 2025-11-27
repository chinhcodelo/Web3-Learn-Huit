import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Web3Context } from '../contexts/Web3Context';
import { UIContext } from '../App';
import { API_URL } from '../config/apiConfig'; // Import từ config

const DoingTest = () => {
  const { id } = useParams();
  const { currentAccount } = useContext(Web3Context);
  const { showToast } = useContext(UIContext);
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentAccount) {
        showToast('error', "Vui lòng kết nối ví!");
        navigate('/');
        return;
    }

    const fetchExam = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/exercise/${id}`);
        setExam(res.data);
      } catch (err) {
        console.error(err);
        showToast('error', "Không tải được bài thi hoặc bài thi không tồn tại.");
        navigate('/market');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id, currentAccount, navigate, showToast]);

  const handleSelect = (qIndex, oIndex) => {
    if (score !== null) return; 
    setUserAnswers({ ...userAnswers, [qIndex]: oIndex });
  };

  const handleSubmit = async () => {
    if (Object.keys(userAnswers).length < exam.questions.length) {
        if (!window.confirm("Bạn chưa làm hết câu hỏi. Có chắc muốn nộp không?")) return;
    }

    let correctCount = 0;
    exam.questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correct_option_index) {
            correctCount++;
        }
    });

    const finalScore = {
        correct: correctCount,
        total: exam.questions.length,
        percentage: Math.round((correctCount / exam.questions.length) * 100)
    };

    setScore(finalScore);
    window.scrollTo(0, 0);

    // --- GỌI API BACKEND ĐỂ NHẬN THƯỞNG ---
    if (correctCount > 0) { 
        try {
            showToast('info', "Đang chấm điểm và gửi thưởng (nếu đậu)...");
            
            const res = await axios.post(`${API_URL}/api/transaction/submit-exam`, {
                user_address: currentAccount,
                exercise_id: id,
                score: correctCount,
                total: exam.questions.length,
                tx_hash_fee: "PREVIOUS_FEE_TX"
            });

            if (res.data.success) {
                if(res.data.message.includes("Chúc mừng")) {
                    showToast('success', res.data.message);
                } else {
                    showToast('info', res.data.message);
                }
            }
        } catch (err) {
            console.error(err);
            showToast('error', "Lỗi kết nối Server khi nhận thưởng.");
        }
    } else {
        showToast('info', "Bạn chưa đúng câu nào, cố gắng lần sau nhé!");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white animate-pulse">⏳ Đang tải đề thi...</div>;
  if (!exam) return null;

  return (
    <div className="pt-24 pb-10 px-4 max-w-4xl mx-auto min-h-screen">
      <div className="glass-panel p-8 mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <span className="bg-blue-900 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase mb-4 inline-block">
            {exam.topic}
        </span>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">{exam.title}</h1>
        <p className="text-gray-400 text-sm">Người tạo: {exam.creator_address}</p>
        
        {score && (
            <div className="mt-6 p-6 bg-emerald-900/30 border border-emerald-500/50 rounded-2xl animate-fade-in-up">
                <h3 className="text-2xl font-bold text-emerald-400 mb-2">Kết Quả: {score.correct}/{score.total}</h3>
                <p className="text-white">Bạn đạt <span className="font-bold text-xl">{score.percentage}%</span> số điểm.</p>
                <button 
                    onClick={() => navigate('/market')}
                    className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                >
                    Quay về Marketplace
                </button>
            </div>
        )}
      </div>

      <div className="space-y-6">
        {exam.questions.map((q, qIdx) => (
            <div key={qIdx} className="glass-panel p-6 border-l-4 border-indigo-500/50">
                <h3 className="text-lg font-bold text-white mb-4 flex gap-3">
                    <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm flex-shrink-0">
                        {qIdx + 1}
                    </span>
                    {q.question_content}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, oIdx) => {
                        let btnClass = "bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-gray-300";
                        
                        if (score) {
                            if (oIdx === q.correct_option_index) btnClass = "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]";
                            else if (userAnswers[qIdx] === oIdx) btnClass = "bg-red-600 border-red-400 text-white opacity-60";
                            else btnClass = "bg-slate-900 border-transparent opacity-40";
                        } else {
                            if (userAnswers[qIdx] === oIdx) btnClass = "bg-indigo-600 border-indigo-400 text-white shadow-lg scale-[1.02]";
                        }

                        return (
                            <button
                                key={oIdx}
                                onClick={() => handleSelect(qIdx, oIdx)}
                                disabled={score !== null}
                                className={`p-4 rounded-xl border text-left transition-all duration-200 ${btnClass}`}
                            >
                                <span className="font-bold mr-2 opacity-70">{['A', 'B', 'C', 'D'][oIdx]}.</span>
                                {opt}
                            </button>
                        );
                    })}
                </div>
            </div>
        ))}
      </div>

      {!score && (
          <div className="mt-10 text-center">
              <button 
                onClick={handleSubmit}
                className="btn-gradient px-12 py-4 text-xl font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform"
              >
                📝 Nộp Bài Thi
              </button>
          </div>
      )}
    </div>
  );
};

export default DoingTest;
