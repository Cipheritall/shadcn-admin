# Mimix Dashboard - Quick Start Guide

## Setup Instructions

### 1. Install Dependencies

```bash
cd mimix-dashboard
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

**For development without authentication**, leave the file as is with an empty Clerk key:

```env
# Leave empty to disable Clerk authentication for development
VITE_CLERK_PUBLISHABLE_KEY=

# Blockchain Configuration (optional - add when ready)
# VITE_BLOCKCHAIN_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
# VITE_BLOCKCHAIN_NETWORK=mainnet
# VITE_BLOCKCHAIN_CHAIN_ID=1
```

**For production with authentication**, add your Clerk key:

```env
# Get your key from https://clerk.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# Blockchain Configuration
VITE_BLOCKCHAIN_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
VITE_BLOCKCHAIN_NETWORK=mainnet
VITE_BLOCKCHAIN_CHAIN_ID=1

# Optional: WebSocket for real-time updates
VITE_BLOCKCHAIN_WS_URL=wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Features Overview

### 🔍 Block Scanner
- **Location**: `/block-scanner`
- **Purpose**: Scan latest blocks and retrieve wallets with high-value transactions
- **Key Features**:
  - Configure number of blocks to scan
  - Set minimum transaction value threshold
  - View discovered high-value wallets
  - Export results to CSV

### 👁️ Wallet Monitor
- **Location**: `/wallet-monitor`
- **Purpose**: Monitor specific wallets for incoming and outgoing transactions
- **Key Features**:
  - Add wallets to monitoring list
  - Track incoming/outgoing transactions
  - View wallet balances
  - Set custom labels for wallets
  - Export monitored wallet data

### 📊 Transaction Tracker
- **Location**: `/transaction-tracker`
- **Purpose**: Track and analyze high-value transactions
- **Key Features**:
  - View all transactions from monitored wallets
  - Group receivers by sender wallets
  - Analyze transaction patterns
  - Export transaction data

### 🔑 Wallet Generator
- **Location**: `/wallet-generator`
- **Purpose**: Generate wallets with custom prefix/suffix patterns
- **Key Features**:
  - Generate wallets with specific prefix/suffix (vanity addresses)
  - Configure funding wallet with private key
  - Fund generated wallets automatically
  - Send zero-amount transactions for testing
  - Export wallets with private keys (⚠️ Handle securely!)

## Data Storage

The application uses Zustand with persistence for state management:

- **Monitored Wallets**: Persisted in localStorage (addresses only, no private keys)
- **Generated Wallets**: Not persisted (for security - stored in memory only during session)
- **Transactions**: Stored in memory only
- **Funding Wallet**: Not persisted (must be configured each session)

## Security Best Practices

⚠️ **IMPORTANT SECURITY NOTES:**

1. **Private Keys**: Never share or commit private keys to version control
2. **Generated Wallets**: Export and store generated wallets securely offline
3. **Funding Wallet**: Re-enter funding wallet credentials each session
4. **Production**: Use environment variables for sensitive configuration
5. **HTTPS**: Always use HTTPS in production
6. **Storage**: Consider using encrypted storage for sensitive data

## Next Steps

### Blockchain Integration

To integrate with real blockchain networks, you'll need to:

1. Install blockchain libraries:
```bash
npm install ethers@6 viem wagmi
```

2. Create blockchain service files in `src/lib/blockchain/`
3. Implement actual RPC calls to blockchain nodes
4. Add real-time transaction monitoring using WebSockets

### Additional Features to Implement

- [ ] Real-time blockchain data fetching
- [ ] Wallet balance updates
- [ ] Transaction notifications
- [ ] Advanced filtering and search
- [ ] Historical data charts
- [ ] API integration for price data
- [ ] Multi-chain support (Ethereum, BSC, Polygon, etc.)
- [ ] Wallet import/export encryption
- [ ] Two-factor authentication

## Development

### Project Structure

```
src/
├── features/
│   ├── block-scanner/      # Block scanning UI
│   ├── wallet-monitor/     # Wallet monitoring UI
│   ├── transaction-tracker/# Transaction tracking UI
│   ├── wallet-generator/   # Wallet generation UI
│   └── dashboard/          # Main dashboard
├── routes/                 # Application routes
├── stores/                 # State management (Zustand)
│   └── blockchain-store.ts # Blockchain data store
├── lib/
│   ├── csv-export.ts       # CSV export utilities
│   └── utils.ts            # General utilities
└── components/             # Reusable UI components
```

### Adding New Features

1. Create feature folder in `src/features/[feature-name]/`
2. Add route in `src/routes/_authenticated/[feature-name].tsx`
3. Update sidebar navigation in `src/components/layout/data/sidebar-data.ts`
4. Add any stores needed in `src/stores/`

## Troubleshooting

### App Keeps Loading But Doesn't Show Anything

**Solution**: Create a `.env` file in the project root:
```bash
touch .env
```

The app requires a `.env` file to be present, even if empty. For development without authentication, the file can contain just:
```env
VITE_CLERK_PUBLISHABLE_KEY=
```

### Port Already in Use
If port 5173 is already in use, you can specify a different port:
```bash
npm run dev -- --port 3000
```

### Dependencies Issues
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
Check TypeScript errors:
```bash
npm run lint
```

## Support & Documentation

- **Vite**: https://vitejs.dev/
- **React**: https://react.dev/
- **TanStack Router**: https://tanstack.com/router
- **Shadcn UI**: https://ui.shadcn.com/
- **Zustand**: https://zustand-demo.pmnd.rs/

## License

MIT License - See LICENSE file for details
