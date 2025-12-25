import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Scan, Wallet, BarChart3 } from 'lucide-react'
import { useState } from 'react'

export default function BlockScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [blocks, setBlocks] = useState(100)
  const [minValue, setMinValue] = useState(10)

  const handleStartScan = () => {
    setIsScanning(true)
    console.log(`Starting scan: ${blocks} blocks, min value: ${minValue} ETH`)
    // TODO: Integrate with scanBlocks service
    setTimeout(() => setIsScanning(false), 3000)
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
            <div className='text-2xl font-bold'>18,543,210</div>
            <p className='text-xs text-muted-foreground'>+1 block from last scan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>High-Value Wallets</CardTitle>
            <Wallet className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>24</div>
            <p className='text-xs text-muted-foreground'>Found in last 100 blocks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Volume</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>1,234.56 ETH</div>
            <p className='text-xs text-muted-foreground'>Across all scanned wallets</p>
          </CardContent>
        </Card>
      </div>

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
          <div className='space-y-2'>
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div className='flex items-center gap-3'>
                <Wallet className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='font-mono text-sm'>0x742d35Cc6634C0532925a3b8...</p>
                  <p className='text-xs text-muted-foreground'>Block #18,543,198</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='font-bold'>45.23 ETH</p>
                <p className='text-xs text-muted-foreground'>2 transactions</p>
              </div>
            </div>
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div className='flex items-center gap-3'>
                <Wallet className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='font-mono text-sm'>0x8f3Cf7ad23Cd3CaDbD9735AF...</p>
                  <p className='text-xs text-muted-foreground'>Block #18,543,195</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='font-bold'>128.45 ETH</p>
                <p className='text-xs text-muted-foreground'>5 transactions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
