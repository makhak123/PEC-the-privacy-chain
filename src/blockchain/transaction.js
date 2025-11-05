import crypto from "crypto"
import { RingSignature } from "../crypto/ring-signature.js"
import { StealthAddress } from "../crypto/stealth-address.js"

export class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
    this.timestamp = Date.now()
    this.signature = null

    // Privacy features
    this.ringSignature = null
    this.stealthAddress = null
    this.encryptedAmount = null
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(this.fromAddress + this.toAddress + this.amount + this.timestamp)
      .digest("hex")
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!")
    }

    const hashTx = this.calculateHash()
    const sig = signingKey.sign(hashTx, "base64")
    this.signature = sig.toDER("hex")
  }

  // Apply ring signature for privacy
  applyRingSignature(privateKey, publicKeys) {
    const ringSig = new RingSignature()
    this.ringSignature = ringSig.sign(this.calculateHash(), privateKey, publicKeys)
  }

  // Generate stealth address for recipient
  generateStealthAddress(recipientPublicKey) {
    const stealth = new StealthAddress()
    this.stealthAddress = stealth.generate(recipientPublicKey)
    return this.stealthAddress
  }

  // Encrypt transaction amount
  encryptAmount(amount) {
    const cipher = crypto.createCipher("aes-256-cbc", "privacy-chain-secret")
    let encrypted = cipher.update(amount.toString(), "utf8", "hex")
    encrypted += cipher.final("hex")
    this.encryptedAmount = encrypted
  }

  isValid() {
    if (this.fromAddress === null) return true // Mining reward

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction")
    }

    // If ring signature is present, verify it
    if (this.ringSignature) {
      const ringSig = new RingSignature()
      return ringSig.verify(this.calculateHash(), this.ringSignature)
    }

    return true
  }
}
