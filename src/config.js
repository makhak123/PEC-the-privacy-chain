export const CONFIG = {
  // Blockchain settings
  DIFFICULTY: 4,
  MINING_REWARD: 100,
  BLOCK_TIME: 10000, // 10 seconds

  // Network settings
  DEFAULT_PORT: 3000,
  MAX_PEERS: 50,
  PEER_TIMEOUT: 30000,

  // Privacy settings
  RING_SIZE: 11, // Number of decoy signatures
  STEALTH_ADDRESS_ENABLED: true,
  CONFIDENTIAL_TRANSACTIONS: true,

  // Wallet settings
  WALLET_FILE: "./wallets.json",

  // Mining settings
  MAX_TRANSACTIONS_PER_BLOCK: 100,
  MIN_TRANSACTION_FEE: 0.001,

  // Currency
  TICKER: "PEC",
  NAME: "Privacy Chain",
  DECIMALS: 8,
  TOTAL_SUPPLY: 21000000,
}
