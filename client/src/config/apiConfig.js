// Nếu có biến môi trường (trên Vercel) thì dùng, không thì dùng localhost (để test ở máy)
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
