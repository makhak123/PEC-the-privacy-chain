import crypto from "crypto"
import { ec as EC } from "elliptic"

const ec = new EC("secp256k1")

export class Wallet {
  constructor() {
    this.keyPair = ec.genKeyPair()
    this.publicKey = this.keyPair.getPublic("hex")
    this.privateKey = this.keyPair.getPrivate("hex")
    this.address = this.generateAddress()
  }

  generateAddress() {
    return crypto.createHash("sha256").update(this.publicKey).digest("hex").substring(0, 40)
  }

  getPublicKey() {
    return this.publicKey
  }

  getPrivateKey() {
    return this.privateKey
  }

  getAddress() {
    return this.address
  }

  sign(data) {
    const hash = crypto.createHash("sha256").update(data).digest("hex")
    const signature = this.keyPair.sign(hash)
    return signature.toDER("hex")
  }

  static verify(publicKey, signature, data) {
    const hash = crypto.createHash("sha256").update(data).digest("hex")
    const key = ec.keyFromPublic(publicKey, "hex")
    return key.verify(hash, signature)
  }

  // Export wallet to JSON
  export() {
    return {
      publicKey: this.publicKey,
      privateKey: this.privateKey,
      address: this.address,
    }
  }

  // Import wallet from JSON
  static import(walletData) {
    const wallet = new Wallet()
    wallet.keyPair = ec.keyFromPrivate(walletData.privateKey, "hex")
    wallet.publicKey = walletData.publicKey
    wallet.privateKey = walletData.privateKey
    wallet.address = walletData.address
    return wallet
  }
}
