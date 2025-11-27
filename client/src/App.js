import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ... Import các trang cũ ...
import LandingPage from './pages/LandingPage';
import Marketplace from './pages/Marketplace';
import CreatorStudio from './pages/CreatorStudio';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import DoingTest from './pages/DoingTest'; // <--- IMPORT FILE MỚI VỪA TẠO

import Navbar from './components/Navbar';
import Toast from './components/Toast';

export const UIContext = React.createContext();

function App() {
  const [notification, setNotification] = useState(null);

  const showToast = (type, message) => {
    setNotification({ type, message });
  };

  return (
    <UIContext.Provider value={{ showToast }}>
      <Router>
        {notification && (
          <Toast type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
        )}
        <Navbar />
        
        {/* KHU VỰC KHAI BÁO ROUTE */}
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/market" element={<Marketplace />} />
            <Route path="/create" element={<CreatorStudio />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* THÊM DÒNG NÀY ĐỂ TRANG BÀI THI HOẠT ĐỘNG */}
            <Route path="/test/:id" element={<DoingTest />} />
          </Routes>
        </div>
      </Router>
    </UIContext.Provider>
  );
}

export default App;