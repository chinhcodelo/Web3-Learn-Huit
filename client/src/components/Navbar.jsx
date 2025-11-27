import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Web3Context } from '../contexts/Web3Context';

const Navbar = () => {
  const { currentAccount, connectWallet, balance } = useContext(Web3Context);
  const location = useLocation();

  // Hàm kiểm tra link đang active
  const navLinkClass = (path) => 
    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      location.pathname === path 
      ? "bg-white/10 text-white shadow-sm" 
      : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    // Thêm backdrop-blur và border dưới
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
              🦄
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Web3<span className="text-indigo-400">Learn</span>
            </span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/market" className={navLinkClass('/market')}>🎯 Sàn Thử Thách</Link>
            <Link to="/create" className={navLinkClass('/create')}>✍️ Creator Studio</Link>
            <Link to="/dashboard" className={navLinkClass('/dashboard')}>🏆 BXH</Link>
          </div>

          {/* Wallet Button */}
          <div className="flex items-center gap-4">
            {currentAccount ? (
              <div className="flex items-center gap-3 bg-slate-800/50 rounded-full pl-4 pr-1 py-1 border border-slate-700">
                <div className="flex flex-col items-end leading-none mr-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Balance</span>
                  <span className="text-sm font-mono text-emerald-400 font-bold">{parseFloat(balance).toFixed(4)} ETH</span>
                </div>
                <Link to="/profile">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-xs text-white font-bold border-2 border-slate-800 shadow-md cursor-pointer hover:opacity-80">
                    {currentAccount.slice(2, 4)}
                  </div>
                </Link>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                className="btn-gradient px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20"
              >
                ⚡ Kết Nối Ví
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;