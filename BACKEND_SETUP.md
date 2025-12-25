# Mimix Backend Setup Guide

## Prerequisites

- Supabase account and project
- Ethereum node access (Infura)
- Etherscan API key

## Step 1: Database Setup

1. Go to your Supabase project: https://ngtkoqdkznbghgtpbzgg.supabase.co
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the SQL to create all tables and policies

## Step 2: Environment Variables

The `.env` file has been configured with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://ngtkoqdkznbghgtpbzgg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_fbEW4XhbDiJlDLdBJGMJcA__cuTepPK

# Blockchain APIs
VITE_ETHERSCAN_API_KEY=2PA48DRGBMUGNIE346QK31M7842JPU7W4K
VITE_INFURA_PROJECT_ID=ce899beccb714c4b91686be3242da48e
VITE_BLOCKCHAIN_RPC_URL=https://mainnet.infura.io/v3/ce899beccb714c4b91686be3242da48e
VITE_BLOCKCHAIN_NETWORK=mainnet
```

## Step 3: Install Dependencies

Dependencies have been installed:
- `@supabase/supabase-js` - Supabase client
- `ethers` - Ethereum library
- `axios` - HTTP client for API calls

## Backend Architecture

### Core Libraries

#### `/src/lib/supabase.ts`
- Supabase client configuration
- TypeScript types for database tables
- Exports: `supabase`, database type interfaces

#### `/src/lib/blockchain.ts`
- Ethereum provider setup (Infura)
- Blockchain interaction functions:
  - `getLatestBlockNumber()` - Get latest block
  - `getBlock(blockNumber)` - Get block data
  - `getTransaction(txHash)` - Get transaction details
  - `getWalletBalance(address)` - Get ETH balance
  - `scanBlocksForHighValueWallets()` - Scan blocks for high-value txs
  - `getWalletTransactions(address)` - Get tx history via Etherscan
  - `generateWallet()` - Generate new random wallet
  - `generateVanityAddress()` - Generate vanity address
  - `sendTransaction()` - Send ETH transaction
  - `getGasPrice()` - Get current gas price

#### `/src/lib/csv-export.ts`
- CSV export utilities (already created)

### Service Layer

#### `/src/services/wallet-monitor.ts`
Functions:
- `addMonitoredWallet(address, label)` - Add wallet to monitoring
- `getMonitoredWallets()` - Get all monitored wallets
- `removeMonitoredWallet(id)` - Remove wallet from monitoring
- `getWalletDetails(address)` - Get wallet balance and transactions
- `updateWalletBalance(id, address)` - Update wallet balance

#### `/src/services/block-scanner.ts`
Functions:
- `scanBlocks(numberOfBlocks, minValueEth)` - Scan blocks for high-value wallets
- `getHighValueWallets(limit)` - Get high-value wallets from DB
- `getScanStatistics()` - Get scan statistics

#### `/src/services/wallet-generator.ts`
Functions:
- `createGeneratedWallet(prefix?, suffix?)` - Generate new wallet
- `getGeneratedWallets()` - Get all generated wallets
- `fundWallet(walletId, fundingPrivateKey, toAddress, amountEth)` - Fund wallet
- `sendZeroAmountTransaction(privateKey, toAddress)` - Send 0 ETH tx
- `deleteGeneratedWallet(id)` - Delete generated wallet

#### `/src/services/transaction-tracker.ts`
Functions:
- `trackWalletTransactions(address, limit)` - Track and save transactions
- `getHighValueTransactions(minValueEth, limit)` - Get high-value txs
- `groupReceiversBySender(minValueEth)` - Group receivers by sender
- `getTransactionStatistics()` - Get transaction stats
- `getRecentTransactions(limit)` - Get recent transactions

## Database Schema

### Tables

1. **monitored_wallets**
   - Stores wallet addresses that users want to monitor
   - Fields: id, address, label, created_at, updated_at, user_id

2. **high_value_wallets**
   - Stores wallets discovered during block scans
   - Fields: id, address, first_seen_block, total_value, transaction_count, last_transaction

3. **transactions**
   - Stores transaction data for tracked wallets
   - Fields: id, hash, from_address, to_address, value, block_number, timestamp, gas_price, gas_used, status

4. **generated_wallets**
   - Stores generated wallets (without private keys for security)
   - Fields: id, address, prefix, suffix, funded, balance, created_at, user_id

5. **scan_history**
   - Tracks block scanning operations
   - Fields: id, start_block, end_block, blocks_scanned, wallets_found, min_value, scan_duration

## Usage Examples

### Monitor a Wallet
```typescript
import { addMonitoredWallet, getWalletDetails } from '@/services/wallet-monitor'

// Add wallet to monitoring
const wallet = await addMonitoredWallet(
  '0x742d35Cc6634C0532925a3b844BC454e4438f44e',
  'My Trading Wallet'
)

// Get wallet details
const details = await getWalletDetails('0x742d35Cc6634C0532925a3b844BC454e4438f44e')
console.log(`Balance: ${details.balance} ETH`)
console.log(`Transactions: ${details.transactions.length}`)
```

### Scan Blocks
```typescript
import { scanBlocks } from '@/services/block-scanner'

// Scan last 100 blocks for wallets with transactions >= 10 ETH
const result = await scanBlocks(100, 10)
console.log(`Found ${result.walletsFound} high-value wallets`)
```

### Generate Wallet
```typescript
import { createGeneratedWallet } from '@/services/wallet-generator'

// Generate vanity address with prefix 'AAAA'
const wallet = await createGeneratedWallet('AAAA')
console.log(`Address: ${wallet.address}`)
console.log(`Private Key: ${wallet.privateKey}`) // Only in response, not stored!
```

### Track Transactions
```typescript
import { trackWalletTransactions, getHighValueTransactions } from '@/services/transaction-tracker'

// Track transactions for a wallet
await trackWalletTransactions('0x742d35Cc6634C0532925a3b844BC454e4438f44e')

// Get high-value transactions (>= 10 ETH)
const highValueTxs = await getHighValueTransactions(10)
```

## Security Notes

⚠️ **IMPORTANT SECURITY CONSIDERATIONS:**

1. **Private Keys**: 
   - Private keys are NEVER stored in the database
   - Only returned once when generating a wallet
   - Users must save private keys securely offline

2. **Environment Variables**:
   - Keep `.env` file secure
   - Never commit to version control
   - Use different keys for production

3. **Supabase RLS**:
   - Row Level Security policies are configured
   - Public access enabled for demo purposes
   - Tighten security for production

4. **Rate Limiting**:
   - Implement rate limiting for API calls
   - Etherscan: 5 calls/second (free tier)
   - Infura: Check your plan limits

5. **Transaction Security**:
   - Always verify addresses before sending funds
   - Test with small amounts first
   - Consider using hardware wallets for funding wallet

## Next Steps

1. **Run Database Schema**: Execute `supabase-schema.sql` in Supabase SQL Editor
2. **Test Services**: Import and test each service function
3. **Update Components**: Integrate services into React components
4. **Add Error Handling**: Implement proper error handling and user feedback
5. **Add Loading States**: Add loading indicators for async operations
6. **Implement Caching**: Cache blockchain data to reduce API calls
7. **Add Background Jobs**: Set up automatic monitoring with webhooks or scheduled functions

## API Limits

### Etherscan (Free Tier)
- 5 calls/second
- 100,000 calls/day

### Infura (Free Tier)
- 100,000 requests/day
- 3 requests/second

Consider upgrading for production use.

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env` file exists and contains correct values
- Restart dev server after updating `.env`

### "Failed to get latest block number"
- Check Infura URL is correct
- Verify Infura project ID is valid
- Check network connection

### "Error getting transactions"
- Verify Etherscan API key
- Check rate limits
- Ensure wallet address is valid

### Database Errors
- Verify tables are created in Supabase
- Check RLS policies if getting permission errors
- Ensure Supabase anon key is correct

## Production Checklist

- [ ] Tighten Supabase RLS policies
- [ ] Add user authentication
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Set up error monitoring (Sentry)
- [ ] Enable HTTPS only
- [ ] Add database backups
- [ ] Implement caching strategy
- [ ] Add API monitoring
- [ ] Create admin dashboard
- [ ] Set up alerting for high-value transactions
- [ ] Implement wallet import/export encryption
