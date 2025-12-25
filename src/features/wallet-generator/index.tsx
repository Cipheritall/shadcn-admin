import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Key, Download, Copy, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

export default function WalletGenerator() {
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [walletCount, setWalletCount] = useState(1)
  const [fundingAddress, setFundingAddress] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [fundingAmount, setFundingAmount] = useState(0.01)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [wallets, setWallets] = useState([
    {
      id: 1,
      address: '0xAAAA1234567890abcdef1234567890abcdefBBBB',
      privateKey: '0x1234567890abcdef...',
      prefix: 'AAAA',
      suffix: 'BBBB',
      funded: true,
      balance: '0.05 ETH',
      createdAt: '2024-12-25 10:30:00',
    },
    {
      id: 2,
      address: '0xCCCC9876543210fedcba9876543210fedcbaDDDD',
      privateKey: '0xfedcba0987654321...',
      prefix: 'CCCC',
      suffix: 'DDDD',
      funded: false,
      balance: '0.00 ETH',
      createdAt: '2024-12-25 10:32:15',
    },
  ])

  const generatedWallets = wallets

  const handleGenerate = () => {
    setIsGenerating(true)
    console.log(`Generating ${walletCount} wallet(s) with prefix: ${prefix}, suffix: ${suffix}`)
    // TODO: Integrate with generateVanityAddress service
    setTimeout(() => setIsGenerating(false), 2000)
  }

  const handleSaveConfig = () => {
    console.log('Config saved:', { fundingAddress, fundingAmount })
  }

  const handleExportCSV = () => {
    console.log('Exporting wallets to CSV')
  }

  const handleFundSelected = () => {
    console.log('Funding selected wallets')
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    console.log(`Copied ${address}`)
  }

  const handleFundWallet = (id: number) => {
    console.log(`Funding wallet ${id}`)
  }

  const handleSendZeroTx = (id: number) => {
    console.log(`Sending 0 amount tx to wallet ${id}`)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Wallet Generator</h1>
          <p className='text-muted-foreground'>
            Generate wallets with custom prefix/suffix and manage funding
          </p>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Generated Wallets</CardTitle>
            <Key className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{generatedWallets.length}</div>
            <p className='text-xs text-muted-foreground'>
              {generatedWallets.filter((w) => w.funded).length} funded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0.05 ETH</div>
            <p className='text-xs text-muted-foreground'>Across all wallets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Funding Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12.45 ETH</div>
            <p className='text-xs text-muted-foreground'>Available for funding</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Generate New Wallet</CardTitle>
            <CardDescription>Create wallets with custom prefix and suffix</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Prefix (4 chars)</label>
              <input
                type='text'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='AAAA'
                maxLength={4}
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.toUpperCase())}
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Suffix (4 chars)</label>
              <input
                type='text'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='BBBB'
                maxLength={4}
                value={suffix}
                onChange={(e) => setSuffix(e.target.value.toUpperCase())}
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Number of Wallets</label>
              <input
                type='number'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='1'
                value={walletCount}
                onChange={(e) => setWalletCount(Number(e.target.value))}
                min={1}
                max={100}
              />
            </div>
            <Button className='w-full' onClick={handleGenerate} disabled={isGenerating}>
              <Key className='mr-2 h-4 w-4' />
              {isGenerating ? 'Generating...' : 'Generate Wallets'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funding Configuration</CardTitle>
            <CardDescription>Configure funding wallet and amount</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Funding Wallet Address</label>
              <input
                type='text'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono'
                placeholder='0x...'
                value={fundingAddress}
                onChange={(e) => setFundingAddress(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Private Key</label>
              <input
                type='password'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono'
                placeholder='0x...'
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Funding Amount (ETH)</label>
              <input
                type='number'
                step='0.001'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='0.01'
                value={fundingAmount}
                onChange={(e) => setFundingAmount(Number(e.target.value))}
              />
            </div>
            <Button className='w-full' variant='outline' onClick={handleSaveConfig}>
              Save Configuration
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Generated Wallets</CardTitle>
              <CardDescription>Manage your generated wallet addresses</CardDescription>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' onClick={handleExportCSV}>
                <Download className='mr-2 h-4 w-4' />
                Export CSV
              </Button>
              <Button variant='outline' size='sm' onClick={handleFundSelected}>
                Fund Selected
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {generatedWallets.map((wallet) => (
              <div
                key={wallet.id}
                className='flex items-center justify-between rounded-lg border p-4'
              >
                <div className='flex-1 space-y-1'>
                  <div className='flex items-center gap-2'>
                    <p className='font-mono text-sm'>{wallet.address}</p>
                    <Button variant='ghost' size='sm' onClick={() => handleCopyAddress(wallet.address)}>
                      <Copy className='h-3 w-3' />
                    </Button>
                  </div>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <span>Prefix: {wallet.prefix}</span>
                    <span>•</span>
                    <span>Suffix: {wallet.suffix}</span>
                    <span>•</span>
                    <span>{wallet.createdAt}</span>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <p className='text-sm font-medium'>{wallet.balance}</p>
                    <Badge variant={wallet.funded ? 'default' : 'secondary'}>
                      {wallet.funded ? 'Funded' : 'Not Funded'}
                    </Badge>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm' title='Fund wallet' onClick={() => handleFundWallet(wallet.id)}>
                      <Send className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='sm' title='Send 0 amount' onClick={() => handleSendZeroTx(wallet.id)}>
                      <Send className='h-4 w-4' />
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
