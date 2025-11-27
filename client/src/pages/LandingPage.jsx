import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="glass-panel p-12 rounded-3xl max-w-4xl animate-fade-in-up">
        <h1 className="text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
          Học Tiếng Anh <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Kiếm Token Thật
          </span>
        </h1>
        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
          Nền tảng Web3 phi tập trung đầu tiên tại Việt Nam kết hợp AI.
          Người làm đúng nhận thưởng. Người làm sai trả tiền cho người tạo.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link to="/market" className="btn-gradient px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:scale-105 transition">
            Bắt đầu Kiếm Tiền 🚀
          </Link>
          <Link to="/create" className="px-8 py-4 rounded-xl text-lg font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition">
            Trở thành Creator ✍️
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-12 border-t pt-8">
          <div>
            <p className="text-3xl font-bold text-gray-800">10k+</p>
            <p className="text-gray-500">Câu hỏi AI duyệt</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800">$50k</p>
            <p className="text-gray-500">Đã trả thưởng</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800">100%</p>
            <p className="text-gray-500">Minh bạch (Blockchain)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;