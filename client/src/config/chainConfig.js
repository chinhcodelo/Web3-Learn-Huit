export const SepoliaConfig = {
  chainId: '0xaa36a7', // Chain ID của Sepolia (11155111)
  chainName: 'Sepolia Testnet',
  nativeCurrency: {
    name: 'SepoliaETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/0UlqyZlp8f5jL02a6NxoI'], // Dùng RPC Public hoặc từ .env nếu muốn
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};