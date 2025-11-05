import crypto from "crypto"

export class Block {
  constructor(index, timestamp, transactions, previousHash = "", nonce = 0) {
    this.index = index
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    this.nonce = nonce
    this.hash = this.calculateHash()
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce)
      .digest("hex")
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join("0")

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++
      this.hash = this.calculateHash()
    }

    console.log(`Block mined: ${this.hash}`)
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false
      }
    }
    return true
  }
}
