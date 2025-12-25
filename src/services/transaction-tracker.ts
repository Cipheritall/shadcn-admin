import { supabase, type Transaction } from '@/lib/supabase'
import { getWalletTransactions } from '@/lib/blockchain'

/**
 * Track transactions for monitored wallets
 */
export async function trackWalletTransactions(address: string, limit = 100) {
  try {
    const transactions = await getWalletTransactions(address)

    // Save transactions to database
    const txData = transactions.slice(0, limit).map((tx: any) => ({
      hash: tx.hash,
      from_address: tx.from,
      to_address: tx.to,
      value: tx.value,
      block_number: parseInt(tx.blockNumber),
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
      gas_price: tx.gasPrice,
      gas_used: tx.gasUsed,
      status: tx.isError === '0' ? 'success' : 'failed',
    }))

    const { data, error } = await supabase
      .from('transactions')
      .upsert(txData, {
        onConflict: 'hash',
      })
      .select()

    if (error) {
      console.error('Error saving transactions:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error tracking transactions:', error)
    return []
  }
}

/**
 * Get high-value transactions
 */
export async function getHighValueTransactions(minValueEth = 10, limit = 50): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('value', (minValueEth * 1e18).toString())
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error getting high-value transactions:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error getting high-value transactions:', error)
    return []
  }
}

/**
 * Group receivers by sender wallets
 */
export async function groupReceiversBySender(minValueEth = 1) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('from_address, to_address, value')
      .gte('value', (minValueEth * 1e18).toString())
      .order('value', { ascending: false })

    if (error) {
      console.error('Error grouping receivers:', error)
      return []
    }

    // Group by sender
    const grouped = new Map<string, { receivers: Set<string>; totalValue: number; txCount: number }>()

    data?.forEach((tx) => {
      const sender = tx.from_address
      const value = parseFloat(tx.value) / 1e18

      if (!grouped.has(sender)) {
        grouped.set(sender, { receivers: new Set(), totalValue: 0, txCount: 0 })
      }

      const group = grouped.get(sender)!
      group.receivers.add(tx.to_address)
      group.totalValue += value
      group.txCount += 1
    })

    // Convert to array
    return Array.from(grouped.entries()).map(([sender, data]) => ({
      sender,
      receivers: Array.from(data.receivers),
      receiverCount: data.receivers.size,
      totalValue: data.totalValue.toFixed(4),
      transactionCount: data.txCount,
    }))
  } catch (error) {
    console.error('Error grouping receivers:', error)
    return []
  }
}

/**
 * Get transaction statistics
 */
export async function getTransactionStatistics() {
  try {
    const { data, error } = await supabase.from('transactions').select('value, status')

    if (error) {
      console.error('Error getting transaction statistics:', error)
      return {
        total: 0,
        successful: 0,
        failed: 0,
        totalValue: '0',
      }
    }

    const total = data.length
    const successful = data.filter((tx) => tx.status === 'success').length
    const failed = data.filter((tx) => tx.status === 'failed').length
    const totalValue = data.reduce((sum, tx) => sum + parseFloat(tx.value) / 1e18, 0)

    return {
      total,
      successful,
      failed,
      totalValue: totalValue.toFixed(4),
    }
  } catch (error) {
    console.error('Error getting transaction statistics:', error)
    return {
      total: 0,
      successful: 0,
      failed: 0,
      totalValue: '0',
    }
  }
}

/**
 * Get recent transactions for all monitored wallets
 */
export async function getRecentTransactions(limit = 50): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error getting recent transactions:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error getting recent transactions:', error)
    return []
  }
}
