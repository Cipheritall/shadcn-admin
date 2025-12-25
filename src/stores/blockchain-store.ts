import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Wallet {
  id: string
  address: string
  label: string
  balance: string
  incomingTx: number
  outgoingTx: number
  lastActivity: string
  status: 'active' | 'inactive'
}

export interface GeneratedWallet {
  id: string
  address: string
  privateKey: string
  prefix: string
  suffix: string
  funded: boolean
  balance: string
  createdAt: string
}

export interface Transaction {
  id: string
  from: string
  to: string
  amount: string
  timestamp: string
  blockNumber: number
  type: 'high-value' | 'incoming' | 'outgoing'
}

export interface FundingWallet {
  address: string
  privateKey: string
  balance: string
}

export interface BlockchainState {
  // Monitored Wallets
  monitoredWallets: Wallet[]
  addMonitoredWallet: (wallet: Omit<Wallet, 'id'>) => void
  removeMonitoredWallet: (id: string) => void
  updateMonitoredWallet: (id: string, wallet: Partial<Wallet>) => void

  // Generated Wallets
  generatedWallets: GeneratedWallet[]
  addGeneratedWallet: (wallet: Omit<GeneratedWallet, 'id'>) => void
  removeGeneratedWallet: (id: string) => void
  updateGeneratedWallet: (id: string, wallet: Partial<GeneratedWallet>) => void

  // Transactions
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  clearTransactions: () => void

  // Funding Wallet
  fundingWallet: FundingWallet | null
  setFundingWallet: (wallet: FundingWallet) => void

  // Settings
  scanSettings: {
    numberOfBlocks: number
    minimumValue: number
  }
  updateScanSettings: (settings: Partial<BlockchainState['scanSettings']>) => void
}

export const useBlockchainStore = create<BlockchainState>()(
  persist(
    (set) => ({
      // Monitored Wallets
      monitoredWallets: [],
      addMonitoredWallet: (wallet) =>
        set((state) => ({
          monitoredWallets: [
            ...state.monitoredWallets,
            { ...wallet, id: crypto.randomUUID() },
          ],
        })),
      removeMonitoredWallet: (id) =>
        set((state) => ({
          monitoredWallets: state.monitoredWallets.filter((w) => w.id !== id),
        })),
      updateMonitoredWallet: (id, wallet) =>
        set((state) => ({
          monitoredWallets: state.monitoredWallets.map((w) =>
            w.id === id ? { ...w, ...wallet } : w
          ),
        })),

      // Generated Wallets
      generatedWallets: [],
      addGeneratedWallet: (wallet) =>
        set((state) => ({
          generatedWallets: [
            ...state.generatedWallets,
            { ...wallet, id: crypto.randomUUID() },
          ],
        })),
      removeGeneratedWallet: (id) =>
        set((state) => ({
          generatedWallets: state.generatedWallets.filter((w) => w.id !== id),
        })),
      updateGeneratedWallet: (id, wallet) =>
        set((state) => ({
          generatedWallets: state.generatedWallets.map((w) =>
            w.id === id ? { ...w, ...wallet } : w
          ),
        })),

      // Transactions
      transactions: [],
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, { ...transaction, id: crypto.randomUUID() }],
        })),
      clearTransactions: () => set({ transactions: [] }),

      // Funding Wallet
      fundingWallet: null,
      setFundingWallet: (wallet) => set({ fundingWallet: wallet }),

      // Settings
      scanSettings: {
        numberOfBlocks: 100,
        minimumValue: 10,
      },
      updateScanSettings: (settings) =>
        set((state) => ({
          scanSettings: { ...state.scanSettings, ...settings },
        })),
    }),
    {
      name: 'mimix-blockchain-storage',
      // Only persist certain fields (exclude sensitive data from localStorage)
      partialize: (state) => ({
        monitoredWallets: state.monitoredWallets.map(({ id, address, label, status }) => ({
          id,
          address,
          label,
          status,
          balance: '0',
          incomingTx: 0,
          outgoingTx: 0,
          lastActivity: '',
        })),
        scanSettings: state.scanSettings,
        // Don't persist generated wallets with private keys or funding wallet
      }),
    }
  )
)
