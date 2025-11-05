import { Blockchain } from "./blockchain/chain.js"
import { Transaction } from "./blockchain/transaction.js"
import { Wallet } from "./wallet/wallet.js"
import { Node } from "./network/node.js"

console.log("=================================")
console.log("   Privacy Chain ($PEC) Node    ")
console.log("=================================\n")

// Initialize blockchain
const privacyChain = new Blockchain()

// Create wallets
console.log("Creating wallets...")
const wallet1 = new Wallet()
const wallet2 = new Wallet()

console.log("Wallet 1 Address:", wallet1.getAddress())
console.log("Wallet 2 Address:", wallet2.getAddress())

// Initialize node
const node = new Node(privacyChain, 3000)
console.log("\nNode ID:", node.nodeId)

// Create and add some transactions
console.log("\nCreating transactions...")
const tx1 = new Transaction(wallet1.getAddress(), wallet2.getAddress(), 50)
tx1.signTransaction(wallet1.keyPair)
tx1.applyRingSignature(wallet1.getPrivateKey(), [wallet1.getPublicKey(), wallet2.getPublicKey()])
privacyChain.addTransaction(tx1)

// Mine block
console.log("\nMining block...")
privacyChain.minePendingTransactions(wallet1.getAddress())

// Check balances
console.log("\n=== Balances ===")
console.log("Wallet 1:", privacyChain.getBalanceOfAddress(wallet1.getAddress()), "PEC")
console.log("Wallet 2:", privacyChain.getBalanceOfAddress(wallet2.getAddress()), "PEC")

// Validate chain
console.log("\nChain valid?", privacyChain.isChainValid())

// Network stats
console.log("\n=== Network Stats ===")
const stats = node.getNetworkStats()
console.log("Peers:", stats.peers)
console.log("Chain Length:", stats.chainLength)
console.log("Pending Transactions:", stats.pendingTransactions)

console.log("\n=================================")
console.log("Node running on port 3000")
console.log("Use CLI for more operations")
console.log("=================================\n")
