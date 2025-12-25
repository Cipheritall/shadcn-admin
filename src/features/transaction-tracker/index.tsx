import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Users, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function TransactionTracker() {
  const handleExportTransactions = () => {
    console.log('Exporting transactions to CSV')
  }

  const handleExportAnalysis = () => {
    console.log('Exporting receiver analysis')
  }

  const transactions = [
    {
      id: 1,
      from: '0x742d35Cc6634C0532925a3b844BC454e4438f44e',
      to: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      amount: '45.23 ETH',
      timestamp: '2024-12-25 14:30:00',
      blockNumber: 18543210,
      type: 'high-value',
    },
    {
      id: 2,
      from: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      to: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      amount: '128.45 ETH',
      timestamp: '2024-12-25 14:28:15',
      blockNumber: 18543205,
      type: 'high-value',
    },
    {
      id: 3,
      from: '0x742d35Cc6634C0532925a3b844BC454e4438f44e',
      to: '0xAAAA1234567890abcdef1234567890abcdefBBBB',
      amount: '12.67 ETH',
      timestamp: '2024-12-25 14:25:30',
      blockNumber: 18543198,
      type: 'outgoing',
    },
  ]

  const receivers = [
    {
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      totalReceived: '173.68 ETH',
      transactionCount: 12,
      senders: 5,
    },
    {
      address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      totalReceived: '256.89 ETH',
      transactionCount: 8,
      senders: 3,
    },
    {
      address: '0xAAAA1234567890abcdef1234567890abcdefBBBB',
      totalReceived: '45.23 ETH',
      transactionCount: 4,
      senders: 2,
    },
  ]

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
            <div className='text-2xl font-bold'>{transactions.length}</div>
            <p className='text-xs text-muted-foreground'>Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>186.35 ETH</div>
            <p className='text-xs text-muted-foreground'>Tracked transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Unique Receivers</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{receivers.length}</div>
            <p className='text-xs text-muted-foreground'>From tracked wallets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Avg Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>62.12 ETH</div>
            <p className='text-xs text-muted-foreground'>Average value</p>
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
          <div className='space-y-3'>
            {transactions.map((tx) => (
              <div key={tx.id} className='flex items-center justify-between rounded-lg border p-4'>
                <div className='flex-1 space-y-1'>
                  <div className='flex items-center gap-2'>
                    <Badge variant={tx.type === 'high-value' ? 'default' : 'secondary'}>
                      {tx.type}
                    </Badge>
                    <span className='text-xs text-muted-foreground'>Block #{tx.blockNumber}</span>
                  </div>
                  <div className='space-y-1 text-sm'>
                    <p className='text-muted-foreground'>
                      <span className='font-medium'>From:</span>{' '}
                      <span className='font-mono'>{tx.from}</span>
                    </p>
                    <p className='text-muted-foreground'>
                      <span className='font-medium'>To:</span>{' '}
                      <span className='font-mono'>{tx.to}</span>
                    </p>
                  </div>
                  <p className='text-xs text-muted-foreground'>{tx.timestamp}</p>
                </div>
                <div className='text-right'>
                  <p className='text-lg font-bold'>{tx.amount}</p>
                </div>
              </div>
            ))}
          </div>
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
          <div className='space-y-3'>
            {receivers.map((receiver) => (
              <div
                key={receiver.address}
                className='flex items-center justify-between rounded-lg border p-4'
              >
                <div className='flex-1 space-y-1'>
                  <p className='font-mono text-sm'>{receiver.address}</p>
                  <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                    <span>{receiver.transactionCount} transactions</span>
                    <span>•</span>
                    <span>From {receiver.senders} senders</span>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='font-bold'>{receiver.totalReceived}</p>
                  <p className='text-xs text-muted-foreground'>Total received</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
