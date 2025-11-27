import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { Web3Context } from '../contexts/Web3Context';
import { useNavigate } from 'react-router-dom';
import { UIContext } from '../App';
import { API_URL } from '../config/apiConfig'; // Import từ config

const Marketplace = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentAccount } = useContext(Web3Context);
  const { showToast } = useContext(UIContext);
  const navigate = useNavigate();

  // --- CẤU HÌNH PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/exercises`);
        setExercises(res.data);
      } catch (err) {
        console.error(err);
        showToast('error', "Không tải được danh sách bài tập!");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [showToast]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExercises = exercises.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(exercises.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBuy = async (ex) => {
    if (!currentAccount) return showToast('error', "Vui lòng kết nối ví trước!");

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const price = ethers.parseEther(ex.price.toString());

        if (!window.confirm(`Xác nhận mua bài thi "${ex.title}" với giá ${ex.price} ETH?`)) return;

        showToast('info', "Đang mở MetaMask để thanh toán...");

        const tx = await signer.sendTransaction({
            to: ex.creator_address,
            value: price
        });
        
        showToast('info', "Giao dịch đã gửi! Đang chờ xác nhận...");
        await tx.wait();

        await axios.post(`${API_URL}/api/transaction/log`, {
            user_address: currentAccount,
            type: 'BUY_EXERCISE',
            amount: -ex.price,
            tx_hash: tx.hash,
            description: `Mua bài thi: ${ex.title}`
        });

        showToast('success', "Mua thành công! Đang chuyển trang...");
        
        setTimeout(() => {
            navigate(`/test/${ex._id}`); 
        }, 1500);

    } catch (err) {
        const errMsg = err.code === 'ACTION_REJECTED' ? 'Bạn đã hủy giao dịch' : err.message;
        showToast('error', `Lỗi: ${errMsg}`);
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-6 min-h-screen flex flex-col">
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-5xl font-heading font-bold text-white drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] mb-4">
          🛒 Cửa Hàng Đề Thi
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Khám phá kho tàng kiến thức Web3. Mua đề thi chất lượng, làm bài và nhận thưởng.
        </p>
      </div>
      
      {!currentAccount && (
        <div className="glass-panel p-4 mb-8 text-center bg-red-500/10 border-red-500/50 text-red-300 font-bold max-w-lg mx-auto rounded-xl backdrop-blur-md">
          ⚠️ Vui lòng kết nối ví để thực hiện giao dịch!
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64 text-indigo-400 font-mono animate-pulse">
          _ Loading Marketplace Data...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentExercises.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-xl mt-10 py-20 border-2 border-dashed border-gray-700 rounded-3xl">
                📭 Chưa có bài tập nào được đăng bán.
              </div>
            ) : (
              currentExercises.map((ex) => (
                <div key={ex._id} className="glass-panel p-6 flex flex-col justify-between hover:-translate-y-2 transition duration-300 group h-full border border-white/5 hover:border-indigo-500/50">
                  <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-indigo-600/20 text-indigo-300 text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-wider border border-indigo-500/20">
                          {ex.topic}
                        </span>
                        <span className="text-xs text-gray-500 font-mono bg-black/30 px-2 py-1 rounded">
                          ID: {ex._id.slice(-4)}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                        {ex.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-[10px] text-white font-bold">
                          {ex.creator_address.slice(2,4)}
                        </div>
                        <p className="text-gray-400 text-xs font-mono">
                          {ex.creator_address.slice(0,6)}...{ex.creator_address.slice(-4)}
                        </p>
                      </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Giá bán</span>
                        <span className="text-emerald-400 font-bold font-mono text-lg">{ex.price} ETH</span>
                      </div>
                      <button 
                          onClick={() => handleBuy(ex)}
                          className="btn-gradient px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-indigo-500/40 active:scale-95 transition-all"
                      >
                          Mua Ngay
                      </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-auto pb-10">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentPage === 1 
                    ? 'bg-white/5 text-gray-600 cursor-not-allowed' 
                    : 'bg-white/10 text-white hover:bg-indigo-600'
                }`}
              >
                ← Trước
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                    currentPage === i + 1
                      ? 'btn-gradient text-white shadow-lg scale-110' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentPage === totalPages 
                    ? 'bg-white/5 text-gray-600 cursor-not-allowed' 
                    : 'bg-white/10 text-white hover:bg-indigo-600'
                }`}
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Marketplace;
