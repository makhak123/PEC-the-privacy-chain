import crypto from "crypto"

export class StealthAddress {
  constructor() {
    this.curve = "secp256k1"
  }

  // Generate a one-time stealth address
  generate(recipientPublicKey) {
    // Generate random value
    const r = crypto.randomBytes(32)

    // Create one-time public key
    const oneTimeKey = crypto.createHash("sha256").update(r).update(recipientPublicKey).digest("hex")

    return {
      oneTimeAddress: oneTimeKey,
      ephemeralKey: r.toString("hex"),
      timestamp: Date.now(),
    }
  }

  // Scan for stealth addresses belonging to a wallet
  scan(privateKey, stealthAddresses) {
    const ownedAddresses = []

    for (const stealth of stealthAddresses) {
      const derivedKey = crypto
        .createHash("sha256")
        .update(Buffer.from(stealth.ephemeralKey, "hex"))
        .update(privateKey)
        .digest("hex")

      if (derivedKey === stealth.oneTimeAddress) {
        ownedAddresses.push(stealth)
      }
    }

    return ownedAddresses
  }

  // Recover private key for a stealth address
  recoverPrivateKey(walletPrivateKey, ephemeralKey) {
    return crypto.createHash("sha256").update(Buffer.from(ephemeralKey, "hex")).update(walletPrivateKey).digest("hex")
  }
}
