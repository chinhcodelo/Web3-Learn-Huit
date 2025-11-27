const { ethers } = require('ethers');
require('dotenv').config();

// 1. Kết nối RPC Sepolia
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);

// 2. Khởi tạo Ví Backend (Người phát thưởng)
// Lưu ý: Private Key lấy từ .env
const signer = new ethers.Wallet(process.env.BACKEND_ISSUER_PRIVATE_KEY, provider);

// 3. Cấu hình Contract (ABI tối giản để gọi hàm thưởng)
// Giả định contract có hàm issueReward(address, uint256)
const contractABI = [
    "function issueReward(address to, uint256 amount) public",
    "function transfer(address to, uint256 amount) public returns (bool)"
];

const daoContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, signer);

console.log(`✅ Web3 Connected: Sepolia | Wallet: ${signer.address}`);

module.exports = { provider, signer, daoContract };