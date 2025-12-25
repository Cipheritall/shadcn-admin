import { ethers } from 'ethers'
import axios from 'axios'

const INFURA_URL = import.meta.env.VITE_BLOCKCHAIN_RPC_URL
const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY
const ETHERSCAN_API_URL = 'https://api.etherscan.io/api'

// Initialize provider
export const provider = new ethers.JsonRpcProvider(INFURA_URL)

export interface BlockData {
  number: number
  hash: string
  timestamp: number
  transactions: string[]
}

export interface TransactionData {
  hash: string
  from: string
  to: string
  value: string
  blockNumber: number
  timestamp: number
  gasPrice: string
  gasUsed: string
}

export interface WalletBalance {
  address: string
  balance: string
  balanceInEth: string
}

/**
 * Get the latest block number
 */
export async function getLatestBlockNumber(): Promise<number> {
  try {
    return await provider.getBlockNumber()
  } catch (error) {
    console.error('Error getting latest block:', error)
    throw new Error('Failed to get latest block number')
  }
}

/**
 * Get block data by block number
 */
export async function getBlock(blockNumber: number): Promise<BlockData | null> {
  try {
    const block = await provider.getBlock(blockNumber, true)
    if (!block) return null

    return {
      number: block.number,
      hash: block.hash || '',
      timestamp: block.timestamp,
      transactions: block.transactions as string[],
    }
  } catch (error) {
    console.error(`Error getting block ${blockNumber}:`, error)
    return null
  }
}

/**
 * Get transaction details
 */
export async function getTransaction(txHash: string): Promise<TransactionData | null> {
  try {
    const tx = await provider.getTransaction(txHash)
    if (!tx) return null

    const receipt = await provider.getTransactionReceipt(txHash)
    const block = await provider.getBlock(tx.blockNumber!)

    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to || '',
      value: ethers.formatEther(tx.value),
      blockNumber: tx.blockNumber!,
      timestamp: block?.timestamp || 0,
      gasPrice: ethers.formatUnits(tx.gasPrice || 0, 'gwei'),
      gasUsed: receipt?.gasUsed.toString() || '0',
    }
  } catch (error) {
    console.error(`Error getting transaction ${txHash}:`, error)
    return null
  }
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(address: string): Promise<WalletBalance> {
  try {
    const balance = await provider.getBalance(address)
    return {
      address,
      balance: balance.toString(),
      balanceInEth: ethers.formatEther(balance),
    }
  } catch (error) {
    console.error(`Error getting balance for ${address}:`, error)
    throw new Error('Failed to get wallet balance')
  }
}

/**
 * Scan blocks for high-value transactions
 */
export async function scanBlocksForHighValueWallets(
  startBlock: number,
  numberOfBlocks: number,
  minValueEth: number
): Promise<Map<string, { value: number; txCount: number }>> {
  const wallets = new Map<string, { value: number; txCount: number }>()
  const minValueWei = ethers.parseEther(minValueEth.toString())

  try {
    for (let i = 0; i < numberOfBlocks; i++) {
      const blockNumber = startBlock - i
      const block = await getBlock(blockNumber)

      if (!block) continue

      // Get all transactions in the block
      for (const txHash of block.transactions) {
        try {
          const tx = await provider.getTransaction(txHash)
          if (!tx) continue

          // Check if transaction value is above threshold
          if (tx.value >= minValueWei) {
            const valueInEth = parseFloat(ethers.formatEther(tx.value))

            // Track sender
            if (tx.from) {
              const fromData = wallets.get(tx.from) || { value: 0, txCount: 0 }
              fromData.value += valueInEth
              fromData.txCount += 1
              wallets.set(tx.from, fromData)
            }

            // Track receiver
            if (tx.to) {
              const toData = wallets.get(tx.to) || { value: 0, txCount: 0 }
              toData.value += valueInEth
              toData.txCount += 1
              wallets.set(tx.to, toData)
            }
          }
        } catch (error) {
          console.error(`Error processing transaction ${txHash}:`, error)
          continue
        }
      }
    }

    return wallets
  } catch (error) {
    console.error('Error scanning blocks:', error)
    throw new Error('Failed to scan blocks')
  }
}

/**
 * Get transactions for a wallet using Etherscan API
 */
export async function getWalletTransactions(
  address: string,
  startBlock = 0,
  endBlock = 99999999
): Promise<any[]> {
  try {
    const response = await axios.get(ETHERSCAN_API_URL, {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: startBlock,
        endblock: endBlock,
        sort: 'desc',
        apikey: ETHERSCAN_API_KEY,
      },
    })

    if (response.data.status === '1') {
      return response.data.result
    }

    return []
  } catch (error) {
    console.error(`Error getting transactions for ${address}:`, error)
    return []
  }
}

/**
 * Generate a new Ethereum wallet
 */
export function generateWallet(): { address: string; privateKey: string; mnemonic: string } {
  const wallet = ethers.Wallet.createRandom()
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || '',
  }
}

/**
 * Generate a vanity address (simplified - for production use a proper vanity generator)
 */
export async function generateVanityAddress(
  prefix?: string,
  suffix?: string,
  maxAttempts = 10000
): Promise<{ address: string; privateKey: string } | null> {
  const prefixLower = prefix?.toLowerCase() || ''
  const suffixLower = suffix?.toLowerCase() || ''

  for (let i = 0; i < maxAttempts; i++) {
    const wallet = ethers.Wallet.createRandom()
    const addressLower = wallet.address.toLowerCase()

    const matchesPrefix = !prefix || addressLower.substring(2, 2 + prefix.length) === prefixLower
    const matchesSuffix =
      !suffix || addressLower.substring(addressLower.length - suffix.length) === suffixLower

    if (matchesPrefix && matchesSuffix) {
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
      }
    }
  }

  return null
}

/**
 * Send transaction
 */
export async function sendTransaction(
  privateKey: string,
  toAddress: string,
  valueEth: string
): Promise<string> {
  try {
    const wallet = new ethers.Wallet(privateKey, provider)
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(valueEth),
    })

    await tx.wait()
    return tx.hash
  } catch (error) {
    console.error('Error sending transaction:', error)
    throw new Error('Failed to send transaction')
  }
}

/**
 * Get current gas price
 */
export async function getGasPrice(): Promise<string> {
  try {
    const feeData = await provider.getFeeData()
    return ethers.formatUnits(feeData.gasPrice || 0, 'gwei')
  } catch (error) {
    console.error('Error getting gas price:', error)
    return '0'
  }
}
