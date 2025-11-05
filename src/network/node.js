import crypto from "crypto"

export class Node {
  constructor(blockchain, port = 3000) {
    this.blockchain = blockchain
    this.port = port
    this.peers = new Set()
    this.nodeId = this.generateNodeId()
  }

  generateNodeId() {
    return crypto.randomBytes(16).toString("hex")
  }

  // Add a peer to the network
  addPeer(peerAddress) {
    this.peers.add(peerAddress)
    console.log(`Peer added: ${peerAddress}`)
  }

  // Remove a peer from the network
  removePeer(peerAddress) {
    this.peers.delete(peerAddress)
    console.log(`Peer removed: ${peerAddress}`)
  }

  // Broadcast a transaction to all peers
  broadcastTransaction(transaction) {
    console.log(`Broadcasting transaction to ${this.peers.size} peers`)

    for (const peer of this.peers) {
      this.sendToPeer(peer, {
        type: "NEW_TRANSACTION",
        data: transaction,
      })
    }
  }

  // Broadcast a new block to all peers
  broadcastBlock(block) {
    console.log(`Broadcasting block ${block.index} to ${this.peers.size} peers`)

    for (const peer of this.peers) {
      this.sendToPeer(peer, {
        type: "NEW_BLOCK",
        data: block,
      })
    }
  }

  // Send data to a specific peer
  sendToPeer(peerAddress, message) {
    // In a real implementation, this would use WebSockets or HTTP
    console.log(`Sending to ${peerAddress}:`, message.type)
  }

  // Handle incoming messages
  handleMessage(message, fromPeer) {
    switch (message.type) {
      case "NEW_TRANSACTION":
        this.handleNewTransaction(message.data)
        break
      case "NEW_BLOCK":
        this.handleNewBlock(message.data)
        break
      case "REQUEST_CHAIN":
        this.sendChain(fromPeer)
        break
      case "CHAIN_RESPONSE":
        this.handleChainResponse(message.data)
        break
      default:
        console.log("Unknown message type:", message.type)
    }
  }

  handleNewTransaction(transaction) {
    try {
      this.blockchain.addTransaction(transaction)
      console.log("New transaction added to pending pool")
    } catch (error) {
      console.error("Invalid transaction received:", error.message)
    }
  }

  handleNewBlock(block) {
    const latestBlock = this.blockchain.getLatestBlock()

    if (block.previousHash === latestBlock.hash && block.index === latestBlock.index + 1) {
      this.blockchain.chain.push(block)
      console.log("New block added to chain")
    } else {
      console.log("Block rejected - requesting full chain")
      this.requestChain()
    }
  }

  requestChain() {
    for (const peer of this.peers) {
      this.sendToPeer(peer, { type: "REQUEST_CHAIN" })
    }
  }

  sendChain(toPeer) {
    this.sendToPeer(toPeer, {
      type: "CHAIN_RESPONSE",
      data: this.blockchain.chain,
    })
  }

  handleChainResponse(chain) {
    if (chain.length > this.blockchain.chain.length) {
      console.log("Longer chain received, validating...")
      // In a real implementation, validate and replace chain
      this.blockchain.chain = chain
    }
  }

  // Get network statistics
  getNetworkStats() {
    return {
      nodeId: this.nodeId,
      port: this.port,
      peers: this.peers.size,
      chainLength: this.blockchain.chain.length,
      pendingTransactions: this.blockchain.pendingTransactions.length,
    }
  }
}
