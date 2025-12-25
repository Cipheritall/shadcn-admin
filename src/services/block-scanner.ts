import { supabase, type HighValueWallet } from '@/lib/supabase'
import { getLatestBlockNumber, scanBlocksForHighValueWallets } from '@/lib/blockchain'

/**
 * Scan blocks for high-value wallets
 */
export async function scanBlocks(numberOfBlocks: number, minValueEth: number) {
  try {
    const latestBlock = await getLatestBlockNumber()
    const wallets = await scanBlocksForHighValueWallets(latestBlock, numberOfBlocks, minValueEth)

    const results: HighValueWallet[] = []

    for (const [address, data] of wallets.entries()) {
      // Save to database
      const { data: saved, error } = await supabase
        .from('high_value_wallets')
        .upsert(
          {
            address,
            first_seen_block: latestBlock,
            total_value: data.value.toString(),
            transaction_count: data.txCount,
            last_transaction: new Date().toISOString(),
          },
          {
            onConflict: 'address',
          }
        )
        .select()
        .single()

      if (!error && saved) {
        results.push(saved)
      }
    }

    return {
      latestBlock,
      scannedBlocks: numberOfBlocks,
      walletsFound: results.length,
      wallets: results,
    }
  } catch (error) {
    console.error('Error scanning blocks:', error)
    throw new Error('Failed to scan blocks')
  }
}

/**
 * Get high-value wallets from database
 */
export async function getHighValueWallets(limit = 50): Promise<HighValueWallet[]> {
  try {
    const { data, error } = await supabase
      .from('high_value_wallets')
      .select('*')
      .order('total_value', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error getting high-value wallets:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error getting high-value wallets:', error)
    return []
  }
}

/**
 * Get scan statistics
 */
export async function getScanStatistics() {
  try {
    const { data, error } = await supabase.from('high_value_wallets').select('*')

    if (error) {
      console.error('Error getting scan statistics:', error)
      return {
        totalWallets: 0,
        totalValue: '0',
        avgValue: '0',
      }
    }

    const totalValue = data.reduce((sum, w) => sum + parseFloat(w.total_value || '0'), 0)
    const avgValue = data.length > 0 ? totalValue / data.length : 0

    return {
      totalWallets: data.length,
      totalValue: totalValue.toFixed(2),
      avgValue: avgValue.toFixed(2),
    }
  } catch (error) {
    console.error('Error getting scan statistics:', error)
    return {
      totalWallets: 0,
      totalValue: '0',
      avgValue: '0',
    }
  }
}
