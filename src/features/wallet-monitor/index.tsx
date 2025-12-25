import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Plus, Trash, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { getMonitoredWallets, removeMonitoredWallet, addMonitoredWallet } from '@/services/wallet-monitor'
import type { MonitoredWallet } from '@/lib/supabase'

export default function WalletMonitor() {
  const [wallets, setWallets] = useState<MonitoredWallet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadWallets()
  }, [])

  const loadWallets = async () => {
    try {
      setLoading(true)
      const data = await getMonitoredWallets()
      setWallets(data)
    } catch (err) {
      setError('Failed to load wallets')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddWallet = async () => {
    const address = prompt('Enter wallet address:')
    const label = prompt('Enter wallet label:')
    if (address && label) {
      const result = await addMonitoredWallet(address, label)
      if (result) {
        await loadWallets()
      } else {
        setError('Failed to add wallet')
      }
    }
  }

  const handleExportCSV = () => {
    console.log('Exporting wallets to CSV')
    // TODO: Export wallets to CSV
  }

  const handleViewWallet = (id: string) => {
    console.log(`View wallet ${id}`)
    // TODO: Navigate to wallet details
  }

  const handleDeleteWallet = async (id: string) => {
    const success = await removeMonitoredWallet(id)
    if (success) {
      setWallets(wallets.filter(w => w.id !== id))
    } else {
      setError('Failed to delete wallet')
    }
  }

  const monitoredWallets = wallets

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Wallet Monitor</h1>
          <p className='text-muted-foreground'>
            Monitor specific wallets for incoming and outgoing transactions
          </p>
        </div>
        <Button onClick={handleAddWallet}>
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
            <div className='text-2xl font-bold'>{loading ? '...' : monitoredWallets.length}</div>
            <p className='text-xs text-muted-foreground'>Total tracked wallets</p>
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
            <Button variant='outline' size='sm' onClick={handleExportCSV}>
              <Download className='mr-2 h-4 w-4' />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='text-center text-muted-foreground'>Loading...</div>
          ) : error ? (
            <div className='text-center text-destructive'>{error}</div>
          ) : monitoredWallets.length === 0 ? (
            <div className='text-center text-muted-foreground'>No wallets monitored. Add a wallet to get started.</div>
          ) : (
            <div className='space-y-3'>
              {monitoredWallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className='flex items-center justify-between rounded-lg border p-4'
                >
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium'>{wallet.label}</p>
                      <Badge variant='default'>Active</Badge>
                    </div>
                    <p className='font-mono text-sm text-muted-foreground'>{wallet.address}</p>
                    <p className='text-xs text-muted-foreground'>
                      Added: {new Date(wallet.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className='flex items-center gap-8'>
                    <div className='flex gap-2'>
                      <Button variant='outline' size='sm' onClick={() => handleViewWallet(wallet.id)}>
                        <Eye className='h-4 w-4' />
                      </Button>
                      <Button variant='outline' size='sm' onClick={() => handleDeleteWallet(wallet.id)}>
                        <Trash className='h-4 w-4' />
                      </Button>
                    </div>
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
