import { supabase, type MonitoredWallet } from '@/lib/supabase'
import { getWalletBalance, getWalletTransactions } from '@/lib/blockchain'

/**
 * Add a wallet to monitoring list
 */
export async function addMonitoredWallet(
  address: string,
  label: string
): Promise<MonitoredWallet | null> {
  try {
    // Get current balance
    const balance = await getWalletBalance(address)

    const { data, error } = await supabase
      .from('monitored_wallets')
      .insert({
        address,
        label,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding monitored wallet:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error adding monitored wallet:', error)
    return null
  }
}

/**
 * Get all monitored wallets
 */
export async function getMonitoredWallets(): Promise<MonitoredWallet[]> {
  try {
    const { data, error } = await supabase
      .from('monitored_wallets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error getting monitored wallets:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error getting monitored wallets:', error)
    return []
  }
}

/**
 * Remove a wallet from monitoring
 */
export async function removeMonitoredWallet(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('monitored_wallets').delete().eq('id', id)

    if (error) {
      console.error('Error removing monitored wallet:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error removing monitored wallet:', error)
    return false
  }
}

/**
 * Get wallet details with transactions
 */
export async function getWalletDetails(address: string) {
  try {
    const [balance, transactions] = await Promise.all([
      getWalletBalance(address),
      getWalletTransactions(address),
    ])

    return {
      address,
      balance: balance.balanceInEth,
      transactions: transactions.slice(0, 50), // Limit to 50 recent transactions
      incomingCount: transactions.filter((tx: any) => tx.to.toLowerCase() === address.toLowerCase())
        .length,
      outgoingCount: transactions.filter(
        (tx: any) => tx.from.toLowerCase() === address.toLowerCase()
      ).length,
    }
  } catch (error) {
    console.error('Error getting wallet details:', error)
    return null
  }
}

/**
 * Update wallet balance
 */
export async function updateWalletBalance(id: string, address: string): Promise<string | null> {
  try {
    const balance = await getWalletBalance(address)
    return balance.balanceInEth
  } catch (error) {
    console.error('Error updating wallet balance:', error)
    return null
  }
}
