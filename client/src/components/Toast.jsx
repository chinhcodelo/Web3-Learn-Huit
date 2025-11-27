import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Tự tắt sau 3 giây
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: '🎉',
    error: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`fixed top-20 right-5 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white transform transition-all duration-500 animate-fade-in-up ${bgColors[type] || bgColors.info}`}>
      <span className="text-2xl">{icons[type]}</span>
      <div>
        <h4 className="font-bold uppercase text-xs opacity-90">{type}</h4>
        <p className="font-medium text-sm">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">✕</button>
    </div>
  );
};

export default Toast;