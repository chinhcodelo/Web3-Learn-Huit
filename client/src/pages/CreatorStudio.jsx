import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { Web3Context } from '../contexts/Web3Context';
import { UIContext } from '../App';
import { API_URL } from '../config/apiConfig'; // Import config

const TREASURY_ADDRESS = "0xcc1634399db720613c6756c7cdc7164f85791aeb"; 

const CreatorStudio = () => {
  const { currentAccount } = useContext(Web3Context);
  const { showToast } = useContext(UIContext);
  
  const [formData, setFormData] = useState({
    title: "",
    topic: "Grammar",
    price: 0.0001,
    questions: [{ question_content: "", options: ["", "", "", ""], correct_option_index: 0 }]
  });
  
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time, msg, type }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    if (formData.questions.length >= 20) return showToast('error', "Tối đa 20 câu thôi!");
    setFormData({
      ...formData,
      questions: [...formData.questions, { question_content: "", options: ["", "", "", ""], correct_option_index: 0 }]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = [...formData.questions];
    newQuestions.splice(index, 1);
    setFormData({ ...formData, questions: newQuestions });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!currentAccount) return showToast('error', "Vui lòng kết nối ví!");

    setLoading(true);
    setLogs([]); 
    addLog("🚀 Bắt đầu quy trình đăng bài...", "info");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const listingFee = ethers.parseEther("0.0005"); 
      
      addLog(`💸 Vui lòng thanh toán phí đăng bài: 0.0005 ETH`, "warning");
      
      const tx = await signer.sendTransaction({
        to: TREASURY_ADDRESS,
        value: listingFee
      });
      
      addLog(`⏳ Đang chờ xác nhận giao dịch...`, "info");
      await tx.wait();
      addLog(`✅ Thanh toán thành công! Hash: ${tx.hash.slice(0, 10)}...`, "success");

      await axios.post(`${API_URL}/api/transaction/log`, {
          user_address: currentAccount,
          type: 'CREATE_FEE',
          amount: -0.0005,
          tx_hash: tx.hash,
          description: `Phí đăng: ${formData.title}`
      });

      addLog("🤖 Đang gửi dữ liệu cho AI Gemini kiểm duyệt...", "info");
      
      const res = await axios.post(`${API_URL}/api/exercises/create`, {
        ...formData,
        creator_address: currentAccount,
        tx_hash: tx.hash
      });

      if (res.data.success) {
        addLog("✅ AI Check: Nội dung Sạch & Hợp lệ", "success");
        addLog(`📦 IPFS: Đã lưu trữ phi tập trung (Hash: ${res.data.ipfs_hash.slice(0,10)}...)`, "success");
        addLog("🎉 HOÀN TẤT: Bài tập đã được đăng!", "success");
        showToast('success', "Đăng bài thành công!");
      } else {
        addLog(`❌ AI TỪ CHỐI: ${res.data.message}`, "error");
        showToast('error', "Bài viết bị AI chặn!");
      }

    } catch (err) {
      console.error(err);
      if (err.code === 'ACTION_REJECTED') {
        addLog("❌ Bạn đã từ chối giao dịch trên ví.", "error");
      } else {
        addLog(`❌ LỖI: ${err.message}`, "error");
      }
    }
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-10 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          <div className="glass-panel p-8">
            <h2 className="text-3xl font-heading font-bold text-white mb-2">Creator Studio</h2>
            <p className="text-gray-400 mb-6">Soạn thảo đề thi (Tối đa 20 câu)</p>
            
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm font-bold mb-2 block">Tên Bài Thi</label>
                  <input 
                    className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white w-full focus:border-indigo-500 outline-none" 
                    placeholder="VD: Ôn tập thì quá khứ đơn" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-bold mb-2 block">Chủ Đề</label>
                  <select 
                    className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white w-full outline-none"
                    value={formData.topic}
                    onChange={e => setFormData({...formData, topic: e.target.value})}
                  >
                    <option value="Grammar">Grammar</option>
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Reading">Reading</option>
                    <option value="IELTS">IELTS</option>
                  </select>
                </div>
              </div>

              <div>
                 <label className="text-gray-300 text-sm font-bold mb-2 block">Giá Bán (ETH)</label>
                 <input 
                    type="number" step="0.0001" 
                    className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white w-full outline-none font-mono text-emerald-400 font-bold"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                 />
              </div>

              <hr className="border-white/10 my-6"/>

              <div className="space-y-6">
                {formData.questions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-white/5 p-6 rounded-2xl border border-white/10 relative group hover:border-indigo-500/50 transition-colors">
                    <div className="flex justify-between mb-4">
                      <span className="font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg">Câu hỏi #{qIdx + 1}</span>
                      {formData.questions.length > 1 && (
                        <button type="button" className="text-red-400 text-sm hover:text-red-300 font-bold" onClick={() => removeQuestion(qIdx)}>
                          🗑️ Xóa
                        </button>
                      )}
                    </div>
                    
                    <textarea 
                      className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white mb-4 focus:border-indigo-500 outline-none" 
                      placeholder="Nhập nội dung câu hỏi..."
                      rows={3}
                      value={q.question_content}
                      onChange={e => handleQuestionChange(qIdx, 'question_content', e.target.value)}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="relative">
                          <span className="absolute left-3 top-3 text-gray-500 text-xs font-bold">{['A','B','C','D'][oIdx]}</span>
                          <input 
                            className="p-3 pl-8 bg-black/20 border border-white/10 rounded-xl text-white w-full text-sm focus:border-indigo-500 outline-none"
                            placeholder={`Đáp án ${oIdx + 1}`}
                            value={opt}
                            onChange={e => handleOptionChange(qIdx, oIdx, e.target.value)}
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-3 bg-black/20 p-3 rounded-xl w-fit">
                      <span className="text-sm text-gray-400 font-bold">Đáp án đúng:</span>
                      <select 
                        className="bg-indigo-600 text-white font-bold p-1 rounded cursor-pointer outline-none"
                        value={q.correct_option_index}
                        onChange={e => handleQuestionChange(qIdx, 'correct_option_index', parseInt(e.target.value))}
                      >
                        <option value={0}>A</option>
                        <option value={1}>B</option>
                        <option value={2}>C</option>
                        <option value={3}>D</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-gray-600 text-gray-400 rounded-xl hover:border-indigo-500 hover:text-indigo-500 transition font-bold">
                + Thêm câu hỏi mới
              </button>

              <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl text-lg font-bold text-white shadow-xl transition-all ${loading ? 'bg-gray-600 cursor-wait' : 'btn-gradient hover:scale-[1.02]'}`}>
                {loading ? "Đang xử lý..." : `💳 Thanh toán phí 0.0005 ETH & Đăng bài`}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-panel p-6 border-l-4 border-indigo-500 sticky top-24 h-[calc(100vh-150px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">AI Monitor</h3>
              <div className="relative">
                <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${loading ? 'bg-green-500 animate-ping' : 'bg-gray-500'}`}></span>
                <span className="text-2xl">🤖</span>
              </div>
            </div>
            
            <div className="flex-grow bg-black/40 rounded-xl p-4 overflow-y-auto font-mono text-xs md:text-sm border border-white/5 shadow-inner custom-scrollbar">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                  <span className="text-4xl mb-2">⌨️</span>
                  <p>Ready to process...</p>
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className={`mb-3 pb-2 border-b border-white/5 last:border-0 ${
                    log.type === 'error' ? 'text-red-400' : 
                    log.type === 'success' ? 'text-emerald-400' : 
                    log.type === 'warning' ? 'text-yellow-400' : 'text-blue-300'
                  }`}>
                    <span className="opacity-50 mr-2">[{log.time}]</span>
                    {log.type === 'error' && '❌ '}
                    {log.type === 'success' && '✅ '}
                    {log.type === 'warning' && '💰 '}
                    {log.msg}
                  </div>
                ))
              )}
              {loading && (
                <div className="animate-pulse text-indigo-400 mt-2">_ System is working...</div>
              )}
              <div ref={logEndRef} />
            </div>

            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Status</p>
              <p className={`font-bold ${
                loading ? 'text-yellow-400' : 
                logs.some(l => l.type === 'error') ? 'text-red-500' : 
                logs.some(l => l.type === 'success') ? 'text-emerald-400' : 'text-gray-300'
              }`}>
                {loading ? "PROCESSING..." : 
                 logs.some(l => l.type === 'error') ? "FAILED" : 
                 logs.some(l => l.type === 'success') ? "COMPLETED" : "IDLE"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreatorStudio;
