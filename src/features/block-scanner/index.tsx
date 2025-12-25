import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Scan, Wallet, BarChart3 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { scanBlocks, getHighValueWallets, getScanStatistics } from '@/services/block-scanner'
import type { HighValueWallet } from '@/lib/supabase'

export default function BlockScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [blocks, setBlocks] = useState(100)
  const [minValue, setMinValue] = useState(10)
  const [wallets, setWallets] = useState<HighValueWallet[]>([])
  const [stats, setStats] = useState({ latestBlock: 0, totalWallets: 0, totalValue: '0', avgValue: '0' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [walletsData, statsData] = await Promise.all([
        getHighValueWallets(50),
        getScanStatistics()
      ])
      setWallets(walletsData)
      // Get latest block from blockchain
      const { getLatestBlockNumber } = await import('@/lib/blockchain')
      const latestBlock = await getLatestBlockNumber()
      setStats({ ...statsData, latestBlock })
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStartScan = async () => {
    setIsScanning(true)
    setError(null)
    try {
      const result = await scanBlocks(blocks, minValue)
      console.log('Scan complete:', result)
      if (result.walletsFound === 0) {
        setError('Scan complete but no high-value wallets found. Try adjusting parameters or check if rate limits were hit.')
      }
      await loadData() // Reload data after scan
    } catch (err: any) {
      if (err?.message?.includes('Too Many Requests') || err?.message?.includes('rate limit')) {
        setError('Infura API rate limit exceeded. Please wait a minute or upgrade your Infura plan.')\n      } else {\n        setError('Scan failed. Make sure database is set up and API credentials are valid.')\n      }
      console.error(err)
    } finally {
      setIsScanning(false)
    }
  }

  const handleStopScan = () => {
    setIsScanning(false)
    console.log('Scan stopped')
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Block Scanner</h1>
          <p className='text-muted-foreground'>
            Scan latest blocks and retrieve wallets with high-value transactions
          </p>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Latest Block</CardTitle>
            <Scan className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{loading ? '...' : stats.latestBlock.toLocaleString()}</div>
            <p className='text-xs text-muted-foreground'>Current blockchain height</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>High-Value Wallets</CardTitle>
            <Wallet className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{loading ? '...' : stats.totalWallets}</div>
            <p className='text-xs text-muted-foreground'>Found in database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Volume</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{loading ? '...' : `${parseFloat(stats.totalValue).toFixed(2)} ETH`}</div>
            <p className='text-xs text-muted-foreground'>Across all scanned wallets</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className='rounded-lg bg-destructive/10 p-4 text-destructive'>
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Scan Configuration</CardTitle>
          <CardDescription>Configure block scanning parameters</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Number of Blocks</label>
              <input
                type='number'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='100'
                value={blocks}
                onChange={(e) => setBlocks(Number(e.target.value))}
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Minimum Value (ETH)</label>
              <input
                type='number'
                step='0.01'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='10'
                value={minValue}
                onChange={(e) => setMinValue(Number(e.target.value))}
              />
            </div>
          </div>
          <div className='flex gap-2'>
            <Button onClick={handleStartScan} disabled={isScanning}>
              <Scan className='mr-2 h-4 w-4' />
              {isScanning ? 'Scanning...' : 'Start Scan'}
            </Button>
            <Button variant='outline' onClick={handleStopScan} disabled={!isScanning}>Stop Scan</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent High-Value Wallets</CardTitle>
          <CardDescription>Wallets discovered in recent scans</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='text-center text-muted-foreground'>Loading...</div>
          ) : wallets.length === 0 ? (
            <div className='text-center text-muted-foreground'>No wallets found. Run a scan to discover high-value wallets.</div>
          ) : (
            <div className='space-y-2'>
              {wallets.map((wallet) => (
                <div key={wallet.id} className='flex items-center justify-between rounded-lg border p-3'>
                  <div className='flex items-center gap-3'>
                    <Wallet className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='font-mono text-sm'>{wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}</p>
                      <p className='text-xs text-muted-foreground'>Block #{wallet.first_seen_block}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-bold'>{(parseFloat(wallet.total_value) / 1e18).toFixed(2)} ETH</p>
                    <p className='text-xs text-muted-foreground'>{wallet.transaction_count} transactions</p>
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
