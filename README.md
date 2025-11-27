-----

# 🎓 Web3 Learn-to-Earn Platform - Đồ Án Tốt Nghiệp HUIT

> **Đề tài:** Lập trình Web3 chuyển đổi số cho trung tâm ngoại ngữ theo mô hình Learn-to-Earn.
> **Sinh viên thực hiện:** Hồ Ngọc Chính
> **Giảng viên hướng dẫn:** ThS. Trần Việt Hùng
> **Trường:** Đại học Công Thương TP.HCM (HUIT)

-----

## 📖 Giới thiệu (Overview)

Dự án là một nền tảng giáo dục phi tập trung **(Decentralized Education Platform)** kết hợp công nghệ **Blockchain** và **AI (Trí tuệ nhân tạo)**. Hệ thống giải quyết các vấn đề về minh bạch trong trả thưởng, bản quyền nội dung và tạo động lực học tập thông qua mô hình kinh tế **Learn-to-Earn** và **Create-to-Earn**.

### 🌟 Tính năng nổi bật

  * **🤖 AI Content Moderation:** Sử dụng **Google Gemini 2.0 Flash** để tự động kiểm duyệt nội dung câu hỏi (chống spam, nội dung xấu, sai ngữ pháp) trước khi đăng tải.
  * **⛓️ Blockchain Payment (Sepolia):**
      * **Create-to-Earn:** Người tạo nội dung (Creator) kiếm tiền khi có người mua bài thi của họ.
      * **Learn-to-Earn:** Người học nhận thưởng Token tự động từ Smart Contract nếu vượt qua bài kiểm tra (\>50% điểm).
  * **📦 Decentralized Storage:** Toàn bộ dữ liệu đề thi được lưu trữ phi tập trung trên **IPFS (Pinata)**, đảm bảo tính vĩnh viễn và minh bạch.
  * **📊 Real-time Dashboard:** Thống kê giao dịch, xếp hạng uy tín (Reputation Score) của người dùng theo thời gian thực.
  * **💎 Gamification:** Hệ thống danh hiệu (Elite/Member) dựa trên thành tích đóng góp.

-----

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Frontend (Client)

  * **Framework:** ReactJS (Create React App)
  * **Styling:** Tailwind CSS (Glassmorphism UI)
  * **Web3:** Ethers.js v6
  * **Routing:** React Router DOM v6

### Backend (Server)

  * **Runtime:** Node.js, Express.js
  * **Database:** MongoDB Atlas (Mongoose)
  * **AI Integration:** Google Gemini API (REST)
  * **Storage:** Pinata SDK (IPFS)

### Blockchain

  * **Network:** Ethereum Sepolia Testnet
  * **Assets:** SepoliaETH (Native Token)

-----

## 🚀 Hướng dẫn cài đặt (Installation)

### 1\. Yêu cầu tiên quyết

  * Node.js (v16 trở lên)
  * Tài khoản MongoDB Atlas
  * Tài khoản Pinata (IPFS)
  * Google AI Studio API Key
  * Ví MetaMask (Mạng Sepolia)

### 2\. Clone dự án

```bash
git clone https://github.com/chinhcodelo/Web3-Learn-Huit.git
cd Web3-Learn-Huit
```

### 3\. Cài đặt & Cấu hình Backend

```bash
cd server
npm install
```

Tạo file `.env` trong thư mục `server/` và điền thông tin:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/Web3Learn
GEMINI_API_KEY=AIzaSy...
PINATA_JWT=eyJhbGciOiJIUzI1Ni...
SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/...
BACKEND_ISSUER_PRIVATE_KEY=0x... (Private Key ví phát thưởng - Cần có SepoliaETH)
```

Khởi chạy Server:

```bash
node server.js
```

### 4\. Cài đặt & Cấu hình Frontend

Mở một terminal mới:

```bash
cd client
npm install
```

Tạo file `.env` (hoặc sửa `src/config/apiConfig.js`) nếu cần trỏ về server deploy (mặc định là `localhost:5000`).

Khởi chạy Client:

```bash
npm start
```

Truy cập: `http://localhost:3000`

-----

## 📸 Hình ảnh Demo (Screenshots)

| Marketplace (Mua bài thi) 
https://github.com/chinhcodelo/learn2earn-web3/blob/main/frontend/8ebcc37fbbdc37826ecd.jpg
| Creator Studio (Đăng bài & AI Check) 
|
![Uploading 91b2836ffbcc77922edd.jpg…]()


| Doing Test (Làm bài) | Profile & History |
| :---: | :---: |
|  |  |

-----

## 🗺️ Quy trình nghiệp vụ (User Flow)

1.  **Creator:** Kết nối ví -\> Soạn đề thi -\> Trả phí niêm yết (0.0005 ETH) -\> AI Duyệt -\> Lưu lên IPFS -\> Public lên chợ.
2.  **Learner:** Kết nối ví -\> Xem chợ đề thi -\> Mua bài (Trả phí cho Creator) -\> Làm bài thi.
3.  **Hệ thống:** Chấm điểm tự động. Nếu đúng \> 50% -\> Ví hệ thống tự động chuyển thưởng (0.0002 ETH) cho Learner.

-----

## 🤝 Đóng góp

Dự án này là sản phẩm đồ án tốt nghiệp cá nhân. Mọi ý kiến đóng góp xin vui lòng liên hệ tác giả.

  * **Email:** ngocchinhh01@gmail.com
  * **GitHub:** [chinhcodelo](https://github.com/chinhcodelo)

-----

*© 2025 Ho Ngoc Chinh - HUIT Graduation Project.*



