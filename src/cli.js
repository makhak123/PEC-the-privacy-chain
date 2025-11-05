import { Blockchain } from "./blockchain/chain.js"
import { Transaction } from "./blockchain/transaction.js"
import { Wallet } from "./wallet/wallet.js"
import fs from "fs"

const WALLET_FILE = "./wallets.json"

class CLI {
  constructor() {
    this.blockchain = new Blockchain()
    this.wallets = this.loadWallets()
  }

  loadWallets() {
    try {
      if (fs.existsSync(WALLET_FILE)) {
        const data = fs.readFileSync(WALLET_FILE, "utf8")
        return JSON.parse(data)
      }
    } catch (error) {
      console.error("Error loading wallets:", error.message)
    }
    return {}
  }

  saveWallets() {
    try {
      fs.writeFileSync(WALLET_FILE, JSON.stringify(this.wallets, null, 2))
    } catch (error) {
      console.error("Error saving wallets:", error.message)
    }
  }

  createWallet() {
    const wallet = new Wallet()
    const walletData = wallet.export()

    this.wallets[wallet.getAddress()] = walletData
    this.saveWallets()

    console.log("\n=== New Wallet Created ===")
    console.log("Address:", wallet.getAddress())
    console.log("Public Key:", wallet.getPublicKey())
    console.log("Private Key:", wallet.getPrivateKey())
    console.log("\nIMPORTANT: Save your private key securely!")
    console.log("===========================\n")

    return wallet
  }

  getBalance(address) {
    const balance = this.blockchain.getBalanceOfAddress(address)
    console.log(`\nBalance of ${address}: ${balance} PEC\n`)
    return balance
  }

  sendTransaction(fromAddress, toAddress, amount) {
    const walletData = this.wallets[fromAddress]

    if (!walletData) {
      console.error("Wallet not found!")
      return
    }

    const wallet = Wallet.import(walletData)
    const transaction = new Transaction(fromAddress, toAddress, amount)

    transaction.signTransaction(wallet.keyPair)

    // Apply privacy features
    const publicKeys = Object.keys(this.wallets).map((addr) => this.wallets[addr].publicKey)
    transaction.applyRingSignature(wallet.getPrivateKey(), publicKeys.slice(0, 5))
    transaction.encryptAmount(amount)

    this.blockchain.addTransaction(transaction)

    console.log("\n=== Transaction Created ===")
    console.log("From:", fromAddress)
    console.log("To:", toAddress)
    console.log("Amount:", amount, "PEC")
    console.log("Status: Pending (waiting for mining)")
    console.log("===========================\n")
  }

  mineBlock(minerAddress) {
    console.log("\n=== Mining Block ===")
    this.blockchain.minePendingTransactions(minerAddress)
    console.log("Mining reward will be sent to:", minerAddress)
    console.log("====================\n")
  }

  viewChain() {
    console.log("\n=== Privacy Chain ($PEC) ===")
    console.log("Chain Length:", this.blockchain.chain.length)
    console.log("Difficulty:", this.blockchain.difficulty)
    console.log("Pending Transactions:", this.blockchain.pendingTransactions.length)
    console.log("Valid:", this.blockchain.isChainValid())
    console.log("\n=== Blocks ===\n")

    for (const block of this.blockchain.chain) {
      console.log(`Block #${block.index}`)
      console.log("Timestamp:", new Date(block.timestamp).toLocaleString())
      console.log("Hash:", block.hash)
      console.log("Previous Hash:", block.previousHash)
      console.log("Nonce:", block.nonce)
      console.log("Transactions:", block.transactions.length)
      console.log("---")
    }
    console.log("\n")
  }

  listWallets() {
    console.log("\n=== Your Wallets ===")
    const addresses = Object.keys(this.wallets)

    if (addresses.length === 0) {
      console.log("No wallets found. Create one with: create-wallet")
    } else {
      addresses.forEach((address, index) => {
        const balance = this.blockchain.getBalanceOfAddress(address)
        console.log(`${index + 1}. ${address} (${balance} PEC)`)
      })
    }
    console.log("====================\n")
  }

  run(args) {
    const command = args[2]

    switch (command) {
      case "create-wallet":
        this.createWallet()
        break

      case "balance":
        if (!args[3]) {
          console.log("Usage: balance <address>")
          break
        }
        this.getBalance(args[3])
        break

      case "send":
        if (!args[3] || !args[4] || !args[5]) {
          console.log("Usage: send <from> <to> <amount>")
          break
        }
        this.sendTransaction(args[3], args[4], Number.parseFloat(args[5]))
        break

      case "mine":
        if (!args[3]) {
          console.log("Usage: mine <reward-address>")
          break
        }
        this.mineBlock(args[3])
        break

      case "view-chain":
        this.viewChain()
        break

      case "list-wallets":
        this.listWallets()
        break

      default:
        console.log("\nPrivacy Chain ($PEC) CLI\n")
        console.log("Available commands:")
        console.log("  create-wallet              - Create a new wallet")
        console.log("  list-wallets               - List all wallets")
        console.log("  balance <address>          - Check wallet balance")
        console.log("  send <from> <to> <amount>  - Send PEC")
        console.log("  mine <address>             - Mine pending transactions")
        console.log("  view-chain                 - View the blockchain")
        console.log("\n")
    }
  }
}

const cli = new CLI()
cli.run(process.argv)
