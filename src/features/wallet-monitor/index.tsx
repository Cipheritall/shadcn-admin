import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Plus, Trash, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function WalletMonitor() {
  const monitoredWallets = [
    {
      id: 1,
      address: '0x742d35Cc6634C0532925a3b844BC454e4438f44e',
      label: 'Main Trading Wallet',
      balance: '245.67 ETH',
      incomingTx: 12,
      outgoingTx: 8,
      lastActivity: '2 hours ago',
      status: 'active',
    },
    {
      id: 2,
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      label: 'Exchange Wallet #1',
      balance: '1,432.89 ETH',
      incomingTx: 45,
      outgoingTx: 32,
      lastActivity: '15 minutes ago',
      status: 'active',
    },
    {
      id: 3,
      address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      label: 'Cold Storage',
      balance: '8,921.34 ETH',
      incomingTx: 2,
      outgoingTx: 0,
      lastActivity: '3 days ago',
      status: 'inactive',
    },
  ]

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Wallet Monitor</h1>
          <p className='text-muted-foreground'>
            Monitor specific wallets for incoming and outgoing transactions
          </p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Add Wallet
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Monitored Wallets</CardTitle>
            <Eye className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{monitoredWallets.length}</div>
            <p className='text-xs text-muted-foreground'>
              {monitoredWallets.filter((w) => w.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>10,599.90 ETH</div>
            <p className='text-xs text-muted-foreground'>Across all wallets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Incoming (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>59</div>
            <p className='text-xs text-muted-foreground'>+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Outgoing (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>40</div>
            <p className='text-xs text-muted-foreground'>-5% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Monitored Wallets</CardTitle>
              <CardDescription>Manage your monitored wallet addresses</CardDescription>
            </div>
            <Button variant='outline' size='sm'>
              <Download className='mr-2 h-4 w-4' />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {monitoredWallets.map((wallet) => (
              <div
                key={wallet.id}
                className='flex items-center justify-between rounded-lg border p-4'
              >
                <div className='flex-1 space-y-1'>
                  <div className='flex items-center gap-2'>
                    <p className='font-medium'>{wallet.label}</p>
                    <Badge variant={wallet.status === 'active' ? 'default' : 'secondary'}>
                      {wallet.status}
                    </Badge>
                  </div>
                  <p className='font-mono text-sm text-muted-foreground'>{wallet.address}</p>
                  <p className='text-xs text-muted-foreground'>
                    Last activity: {wallet.lastActivity}
                  </p>
                </div>
                <div className='flex items-center gap-8'>
                  <div className='text-right'>
                    <p className='text-sm font-medium'>{wallet.balance}</p>
                    <p className='text-xs text-muted-foreground'>
                      In: {wallet.incomingTx} | Out: {wallet.outgoingTx}
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm'>
                      <Eye className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='sm'>
                      <Trash className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
