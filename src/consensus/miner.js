export class Miner {
  constructor(blockchain, rewardAddress) {
    this.blockchain = blockchain
    this.rewardAddress = rewardAddress
    this.isMining = false
  }

  startMining() {
    if (this.isMining) {
      console.log("Already mining...")
      return
    }

    this.isMining = true
    console.log("Starting mining process...")

    this.mine()
  }

  stopMining() {
    this.isMining = false
    console.log("Mining stopped")
  }

  mine() {
    if (!this.isMining) return

    if (this.blockchain.pendingTransactions.length === 0) {
      console.log("No transactions to mine. Waiting...")
      setTimeout(() => this.mine(), 5000)
      return
    }

    console.log(`Mining block with ${this.blockchain.pendingTransactions.length} transactions...`)

    const startTime = Date.now()
    this.blockchain.minePendingTransactions(this.rewardAddress)
    const endTime = Date.now()

    console.log(`Block mined in ${(endTime - startTime) / 1000} seconds`)
    console.log(`Reward: ${this.blockchain.miningReward} PEC`)

    // Continue mining
    if (this.isMining) {
      setTimeout(() => this.mine(), 1000)
    }
  }

  getHashRate() {
    // Simplified hash rate calculation
    return Math.floor(Math.random() * 1000000)
  }

  getMiningStats() {
    return {
      isMining: this.isMining,
      rewardAddress: this.rewardAddress,
      difficulty: this.blockchain.difficulty,
      pendingTransactions: this.blockchain.pendingTransactions.length,
      estimatedHashRate: this.getHashRate(),
    }
  }
}
