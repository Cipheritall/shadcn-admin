import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Users, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { getHighValueTransactions, groupReceiversBySender, getTransactionStatistics } from '@/services/transaction-tracker'
import type { Transaction } from '@/lib/supabase'

export default function TransactionTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [receivers, setReceivers] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, successful: 0, failed: 0, totalValue: '0' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [txData, receiverData, statsData] = await Promise.all([
        getHighValueTransactions(10, 50),
        groupReceiversBySender(1),
        getTransactionStatistics()
      ])
      setTransactions(txData)
      setReceivers(receiverData)
      setStats(statsData)
    } catch (err) {
      console.error('Failed to load transaction data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExportTransactions = () => {
    const csv = transactions.map(tx => `${tx.hash},${tx.from_address},${tx.to_address},${tx.value},${tx.timestamp}`).join('\n')
    const blob = new Blob(['Hash,From,To,Value,Timestamp\n' + csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
  }

  const handleExportAnalysis = () => {
    const csv = receivers.map(r => `${r.receiver_address},${r.total_received},${r.transaction_count},${r.unique_senders}`).join('\n')
    const blob = new Blob(['Receiver,Total Received,Tx Count,Unique Senders\n' + csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'receiver-analysis.csv'
    a.click()
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Transaction Tracker</h1>
          <p className='text-muted-foreground'>
            Track high-value transactions and group receivers by sender wallets
          </p>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Transactions</CardTitle>
            <ArrowUpDown className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{loading ? '...' : stats.total}</div>
            <p className='text-xs text-muted-foreground'>High-value transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{loading ? '...' : `${stats.totalValue} ETH`}</div>
            <p className='text-xs text-muted-foreground'>Tracked transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Unique Receivers</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{loading ? '...' : receivers.length}</div>
            <p className='text-xs text-muted-foreground'>From tracked wallets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{loading ? '...' : stats.successful}</div>
            <p className='text-xs text-muted-foreground'>{stats.failed} failed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>High-Value Transactions</CardTitle>
              <CardDescription>Recent transactions from monitored wallets</CardDescription>
            </div>
            <Button variant='outline' size='sm' onClick={handleExportTransactions}>
              <Download className='mr-2 h-4 w-4' />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='text-center text-muted-foreground'>Loading...</div>
          ) : transactions.length === 0 ? (
            <div className='text-center text-muted-foreground'>No high-value transactions found</div>
          ) : (
            <div className='space-y-3'>
              {transactions.map((tx) => (
                <div key={tx.id} className='flex items-center justify-between rounded-lg border p-4'>
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center gap-2'>
                      <Badge variant='default'>high-value</Badge>
                      <span className='text-xs text-muted-foreground'>Block #{tx.block_number}</span>
                    </div>
                    <div className='space-y-1 text-sm'>
                      <p className='text-muted-foreground'>
                        <span className='font-medium'>From:</span>{' '}
                        <span className='font-mono'>{tx.from_address.slice(0, 10)}...{tx.from_address.slice(-8)}</span>
                      </p>
                      <p className='text-muted-foreground'>
                        <span className='font-medium'>To:</span>{' '}
                        <span className='font-mono'>{tx.to_address.slice(0, 10)}...{tx.to_address.slice(-8)}</span>
                      </p>
                    </div>
                    <p className='text-xs text-muted-foreground'>{new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-bold'>{(parseFloat(tx.value) / 1e18).toFixed(2)} ETH</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Receiver Analysis</CardTitle>
              <CardDescription>Grouped receivers by transaction volume</CardDescription>
            </div>
            <Button variant='outline' size='sm' onClick={handleExportAnalysis}>
              <Download className='mr-2 h-4 w-4' />
              Export Analysis
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='text-center text-muted-foreground'>Loading...</div>
          ) : receivers.length === 0 ? (
            <div className='text-center text-muted-foreground'>No receiver data available</div>
          ) : (
            <div className='space-y-3'>
              {receivers.map((receiver) => (
                <div
                  key={receiver.receiver_address}
                  className='flex items-center justify-between rounded-lg border p-4'
                >
                  <div className='flex-1 space-y-1'>
                    <p className='font-mono text-sm'>{receiver.receiver_address.slice(0, 10)}...{receiver.receiver_address.slice(-8)}</p>
                    <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                      <span>{receiver.transaction_count} transactions</span>
                      <span>•</span>
                      <span>From {receiver.unique_senders} senders</span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-bold'>{(parseFloat(receiver.total_received) / 1e18).toFixed(2)} ETH</p>
                    <p className='text-xs text-muted-foreground'>Total received</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
