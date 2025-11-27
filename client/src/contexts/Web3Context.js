import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SepoliaConfig } from '../config/chainConfig';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [balance, setBalance] = useState("0"); // Khởi tạo là chuỗi "0" để tránh NaN

  // Hàm cập nhật số dư an toàn
  const updateBalance = async (account) => {
    if (account && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(account);
        setBalance(ethers.formatEther(bal)); // Chuyển Wei sang ETH
      } catch (error) {
        console.error("Lỗi lấy số dư:", error);
        setBalance("0");
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Cài Metamask đi bạn!");

    try {
      // 1. Chuyển mạng Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SepoliaConfig.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SepoliaConfig],
        });
      }
    }

    // 2. Lấy tài khoản
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    
    if (accounts.length > 0) {
      setCurrentAccount(accounts[0]);
      await updateBalance(accounts[0]); // Gọi hàm updateBalance tách riêng
    }
  };

  useEffect(() => {
    if(window.ethereum) {
      // Tự động kết nối lại khi refresh
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          updateBalance(accounts[0]);
        }
      });

      // Lắng nghe sự kiện đổi ví
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          updateBalance(accounts[0]);
        } else {
          setCurrentAccount("");
          setBalance("0");
        }
      });
    }
  }, []);

  return (
    <Web3Context.Provider value={{ currentAccount, balance, connectWallet, updateBalance }}>
      {children}
    </Web3Context.Provider>
  );
};