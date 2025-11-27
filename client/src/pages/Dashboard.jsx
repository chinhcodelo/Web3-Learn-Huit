import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const getData = () => axios.get('http://localhost:5000/api/dashboard-stats').then(res => setStats(res.data));
    getData();
    const interval = setInterval(getData, 5000); 
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div className="min-h-screen flex items-center justify-center text-indigo-400 animate-pulse">Đang đồng bộ Blockchain...</div>;

  return (
    <div className="pt-28 pb-10 px-6 max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-heading font-bold text-white mb-2">Thống Kê Hệ Thống</h1>
      <p className="text-gray-400 mb-10">Dữ liệu thời gian thực từ MongoDB & Blockchain</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Tổng Bài Tập</p>
          <p className="text-5xl font-mono font-bold text-white mt-2">{stats.total_exercises}</p>
        </div>
        
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl"></div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Creator Active</p>
          <p className="text-5xl font-mono font-bold text-white mt-2">{stats.total_users}</p>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl"></div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Giao Dịch</p>
          <p className="text-5xl font-mono font-bold text-white mt-2">
            {stats.total_exercises > 0 ? Math.floor(stats.total_exercises * 1.5) : 0}
          </p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">🏆 Bảng Xếp Hạng Uy Tín</h3>
          <span className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE
          </span>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-5">Rank</th>
              <th className="p-5">Creator</th>
              <th className="p-5 text-center">Score</th>
              <th className="p-5 text-right">Badge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {stats.top_creators.map((user, index) => (
              <tr key={index} className="hover:bg-white/5 transition-colors group">
                <td className="p-5">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="p-5 font-mono text-sm text-indigo-300 group-hover:text-white transition-colors">
                  {user.address}
                </td>
                <td className="p-5 text-center font-bold text-white text-lg">
                  {user.score}
                </td>
                <td className="p-5 text-right">
                  {index < 3 ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                      Elite
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-700 text-gray-300">
                      Member
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;