import React, { useContext, useEffect, useState } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import axios from 'axios';
import { API_URL } from '../config/apiConfig';

const ProfilePage = () => {
  const { currentAccount, balance } = useContext(Web3Context);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentAccount) {
      setLoading(true);
      axios.get(`${API_URL}/api/user/${currentAccount}/history`)
        .then(res => setHistory(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [currentAccount]);

  if (!currentAccount) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      <p>⚠️ Vui lòng kết nối ví để xem hồ sơ.</p>
    </div>
  );

  return (
    <div className="pt-28 pb-10 px-6 max-w-5xl mx-auto animate-fade-in">
      <div className="glass-panel p-8 md:p-10 mb-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-600 p-[2px] shadow-2xl">
          <div className="w-full h-full bg-[#0B0E14] rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
              {currentAccount.slice(2, 4)}
            </span>
          </div>
        </div>

        <div className="text-center md:text-left z-10">
          <h2 className="text-3xl font-heading font-bold text-white">Nhà Sáng Tạo Web3</h2>
          <p className="font-mono text-gray-400 bg-black/30 px-3 py-1 rounded-lg mt-2 inline-block border border-white/5">
            {currentAccount}
          </p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
            <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm">
              💰 {parseFloat(balance).toFixed(4)} ETH
            </div>
            <div className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-sm">
              🏆 Uy tín: Cao
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-pink-500 rounded-full block"></span>
        Lịch sử biến động số dư
      </h3>
      
      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Đang tải dữ liệu từ Blockchain...</div>
        ) : history.length === 0 ? (
          <div className="p-10 text-center text-gray-500">Chưa có giao dịch nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Thời gian</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Hoạt động</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Chi tiết</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Biến động</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((tx, idx) => {
                  const amount = tx.amount ? parseFloat(tx.amount) : 0;
                  const type = tx.type || 'UNKNOWN';

                  return (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="p-5 text-sm text-gray-400 font-mono">
                        {new Date(tx.timestamp).toLocaleString('vi-VN')}
                      </td>

                      <td className="p-5 text-sm font-bold text-white">
                          {type === 'BUY_EXERCISE' && <span className="text-blue-400">🛒 Mua bài thi</span>}
                          {type === 'SELL_EXERCISE' && <span className="text-purple-400">💰 Bán bài thi</span>} 
                          {type === 'CREATE_FEE' && <span className="text-orange-400">📝 Phí đăng bài</span>}
                          {type === 'REWARD' && <span className="text-emerald-400">🎁 Nhận thưởng</span>}
                          {type === 'STAKE_LOSS' && <span className="text-red-400">💸 Mất cược</span>}
                          
                          {!['BUY_EXERCISE', 'SELL_EXERCISE', 'CREATE_FEE', 'REWARD', 'STAKE_LOSS'].includes(type) && (
                            <span className="text-gray-500 uppercase">{type}</span>
                          )}
                      </td>

                      <td className="p-5 text-sm text-gray-400 italic max-w-xs truncate">
                          {tx.description || (tx.exercise_id ? `Bài tập ID: ${tx.exercise_id._id || tx.exercise_id}` : 'Giao dịch hệ thống')}
                      </td>

                      <td className={`p-5 text-sm font-bold text-right font-mono ${amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {amount > 0 ? '+' : ''}{amount} ETH
                      </td>

                      <td className="p-5 text-right">
                          {tx.tx_hash && tx.tx_hash !== "NO_HASH" && tx.tx_hash !== "PREVIOUS_FEE_TX" ? (
                              <a 
                                  href={`https://sepolia.etherscan.io/tx/${tx.tx_hash}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                              >
                                  Explore ↗
                              </a>
                          ) : (
                              <span className="text-gray-600 text-xs">--</span>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
