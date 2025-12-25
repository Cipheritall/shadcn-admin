# Mimix Dashboard

Blockchain wallet monitoring and management dashboard for tracking high-value transactions and wallet activity.

## Features

### Blockchain Analysis
- **Block Scanner**: Scan latest blocks and retrieve wallets with high-value transactions
- **Wallet Monitor**: Monitor specific wallets for incoming and outgoing transactions
- **Transaction Tracking**: Track receivers from wallets with high-value transactions
- **Receiver Grouping**: Regroup receivers by wallets that sent them funds

### Wallet Management
- **Wallet Generator**: Generate wallets with specific prefix and suffix patterns
- **Wallet Storage**: Store a list of wallets to monitor for incoming transactions
- **Funding Wallet**: Configure and manage funding wallet with private key
- **Wallet Funding**: Fund generated wallets from the funding wallet
- **Zero-Amount Transactions**: Send 0 amount transactions from generated wallets

### Data Export
- **CSV Export**: Export transaction data in CSV format for further analysis
- **Wallet Export**: Export generated wallets with their private keys in CSV format

### UI Features
- Light/dark mode
- Responsive design
- Accessible components
- Built-in Sidebar navigation
- Global search command
- RTL support

## Tech Stack

- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **UI Library**: Shadcn UI
- **Routing**: TanStack Router
- **State Management**: Zustand
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── features/
│   ├── block-scanner/      # Block scanning functionality
│   ├── wallet-monitor/     # Wallet monitoring features
│   ├── transaction-track/  # Transaction tracking
│   ├── wallet-generator/   # Wallet generation tools
│   └── data-export/        # Export functionality
├── components/             # Reusable UI components
├── routes/                 # Application routes
├── stores/                 # State management
├── lib/                    # Utilities and helpers
└── styles/                 # Global styles
```

## Development

```bash
# Run linter
pnpm lint

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## License

MIT License - see LICENSE file for details
