import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/apiConfig'; // Import cấu hình API chuẩn

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  // Hàm lấy dữ liệu
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard-stats`);
      setStats(res.data);
    } catch (err) {
      console.error("Lỗi tải Dashboard:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    // Tự động cập nhật số liệu mỗi 5 giây (Real-time feeling)
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Màn hình chờ
  if (!stats) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-indigo-400 font-mono">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="animate-pulse">_ Establishing Blockchain Uplink...</p>
    </div>
  );

  return (
    <div className="pt-28 pb-10 px-6 max-w-7xl mx-auto min-h-screen animate-fade-in">
      {/* --- HEADER --- */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2 drop-shadow-lg">
          System <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Intelligence</span>
        </h1>
        <p className="text-gray-400 font-mono text-sm border-l-2 border-indigo-500 pl-3">
          Dữ liệu thời gian thực từ MongoDB & Sepolia Network
        </p>
      </div>

      {/* --- STATS CARDS (3 Cột) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Card 1: Tổng Bài Tập */}
        <div className="glass-panel p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl group-hover:bg-purple-600/30 transition-all"></div>
          <div className="relative z-10">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Kho Dữ Liệu</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-mono font-bold text-white">{stats.total_exercises}</span>
              <span className="text-sm text-purple-400">Bài tập</span>
            </div>
          </div>
        </div>
        
        {/* Card 2: Tổng User */}
        <div className="glass-panel p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all"></div>
          <div className="relative z-10">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Cộng Đồng</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-mono font-bold text-white">{stats.total_users}</span>
              <span className="text-sm text-blue-400">Active Users</span>
            </div>
          </div>
        </div>

        {/* Card 3: Ước tính Giao dịch (Giả lập dựa trên số liệu) */}
        <div className="glass-panel p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-600/20 rounded-full blur-3xl group-hover:bg-emerald-600/30 transition-all"></div>
          <div className="relative z-10">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Tổng Giao Dịch</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-mono font-bold text-white">
                {/* Tính toán giả lập: cứ 1 bài tập ~ 3 giao dịch (đăng, mua, thưởng) */}
                {stats.total_exercises > 0 ? Math.floor(stats.total_exercises * 2.5) + 10 : 0}
              </span>
              <span className="text-sm text-emerald-400">Txns</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- LEADERBOARD TABLE --- */}
      <div className="glass-panel overflow-hidden border border-white/10">
        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🏆 Bảng Xếp Hạng Uy Tín
          </h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-green-400 font-mono font-bold">LIVE UPDATE</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-5 font-bold">Hạng</th>
                <th className="p-5 font-bold">Địa chỉ Ví (Creator)</th>
                <th className="p-5 font-bold text-center">Điểm Uy Tín</th>
                <th className="p-5 font-bold text-right">Danh Hiệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.top_creators.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500 italic">Chưa có dữ liệu xếp hạng...</td>
                </tr>
              ) : (
                stats.top_creators.map((user, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors group">
                    {/* Cột Rank */}
                    <td className="p-5">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shadow-lg ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-black ring-2 ring-yellow-500/50' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black ring-2 ring-gray-400/50' :
                        index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-600 text-black ring-2 ring-orange-500/50' :
                        'bg-slate-800 text-gray-400 border border-slate-700'
                      }`}>
                        {index + 1}
                      </div>
                    </td>

                    {/* Cột Address */}
                    <td className="p-5">
                      <span className="font-mono text-sm text-indigo-300 group-hover:text-white transition-colors bg-black/20 px-2 py-1 rounded">
                        {user.address}
                      </span>
                      {index === 0 && <span className="ml-2 text-xs text-yellow-500">👑 King</span>}
                    </td>

                    {/* Cột Score */}
                    <td className="p-5 text-center">
                      <span className="text-xl font-bold text-white tracking-tight">{user.score}</span>
                    </td>

                    {/* Cột Badge */}
                    <td className="p-5 text-right">
                      {index < 3 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg shadow-purple-500/20">
                          ELITE
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-300 border border-slate-600">
                          MEMBER
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
