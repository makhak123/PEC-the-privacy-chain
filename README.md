# Privacy Chain ($PEC)

A fully private blockchain implementation with advanced cryptographic privacy features.

FLRZr4MsWsym3Kj4rLZRDJoK5uTkGRXaEjnpKiht4t9P

## Features

- **Ring Signatures**: Hide transaction sender among a group of possible signers
- **Stealth Addresses**: Generate one-time addresses for each transaction
- **Confidential Transactions**: Hide transaction amounts
- **Zero-Knowledge Proofs**: Verify transactions without revealing details
- **Decentralized P2P Network**: Distributed node communication
- **Proof of Work Consensus**: Secure mining mechanism

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

### Start a Node

\`\`\`bash
npm start
\`\`\`

### CLI Commands

\`\`\`bash
# Create a new wallet
node src/cli.js create-wallet

# Check balance
node src/cli.js balance <address>

# Send private transaction
node src/cli.js send <from> <to> <amount>

# Mine a block
node src/cli.js mine <address>

# View blockchain
node src/cli.js view-chain
\`\`\`

## Architecture

- `src/blockchain/` - Core blockchain implementation
- `src/crypto/` - Privacy cryptographic functions
- `src/network/` - P2P networking layer
- `src/wallet/` - Wallet management
- `src/consensus/` - Mining and consensus
- `src/cli.js` - Command-line interface

## Privacy Features

### Ring Signatures
Transactions are signed using ring signatures, making it impossible to determine which member of a group actually signed the transaction.

### Stealth Addresses
Each transaction generates a unique one-time address, preventing address reuse and transaction linking.

### Confidential Transactions
Transaction amounts are encrypted using Pedersen commitments, hiding the actual values while still allowing verification.

## License

MIT
