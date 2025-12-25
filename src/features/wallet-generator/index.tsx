import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Key, Download, Copy, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { createGeneratedWallet, getGeneratedWallets, fundWallet, sendZeroAmountTransaction } from '@/services/wallet-generator'
import type { GeneratedWallet } from '@/lib/supabase'

export default function WalletGenerator() {
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [walletCount, setWalletCount] = useState(1)
  const [fundingAddress, setFundingAddress] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [fundingAmount, setFundingAmount] = useState(0.01)
  const [isGenerating, setIsGenerating] = useState(false)
  const [wallets, setWallets] = useState<GeneratedWallet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadWallets()
  }, [])

  const loadWallets = async () => {
    try {
      setLoading(true)
      const data = await getGeneratedWallets()
      setWallets(data)
    } catch (err) {
      setError('Failed to load wallets')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const generatedWallets = wallets

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      for (let i = 0; i < walletCount; i++) {
        await createGeneratedWallet(prefix || undefined, suffix || undefined)
      }
      await loadWallets()
    } catch (err) {
      setError('Failed to generate wallet. This may take time for vanity addresses.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveConfig = () => {
    console.log('Config saved:', { fundingAddress, fundingAmount })
    alert('Configuration saved locally')
  }

  const handleExportCSV = () => {
    const csv = wallets.map(w => `${w.address},${w.prefix || ''},${w.suffix || ''},${w.balance},${w.funded}`).join('\n')
    const blob = new Blob(['Address,Prefix,Suffix,Balance,Funded\n' + csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated-wallets.csv'
    a.click()
  }

  const handleFundSelected = () => {
    alert('Select wallets to fund (feature coming soon)')
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    alert(`Copied ${address}`)
  }

  const handleFundWallet = async (wallet: GeneratedWallet) => {
    if (!fundingAddress || !privateKey) {
      setError('Please configure funding wallet and private key first')
      return
    }
    try {
      await fundWallet(wallet.address, fundingAmount, fundingAddress, privateKey)
      await loadWallets()
      alert('Wallet funded successfully')
    } catch (err) {
      setError('Failed to fund wallet')
      console.error(err)
    }
  }

  const handleSendZeroTx = async (wallet: GeneratedWallet) => {
    if (!fundingAddress || !privateKey) {
      setError('Please configure funding wallet and private key first')
      return
    }
    try {
      await sendZeroAmountTransaction(wallet.address, fundingAddress, privateKey)
      alert('Zero-amount transaction sent successfully')
    } catch (err) {
      setError('Failed to send transaction')
      console.error(err)
    }
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

      {error && (
        <div className='rounded-lg bg-destructive/10 p-4 text-destructive'>
          {error}
        </div>
      )}

      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Generated Wallets</CardTitle>
            <Key className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{loading ? '...' : generatedWallets.length}</div>
            <p className='text-xs text-muted-foreground'>
              {loading ? '...' : generatedWallets.filter((w) => w.funded).length} funded
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
          {loading ? (
            <div className='text-center text-muted-foreground'>Loading...</div>
          ) : generatedWallets.length === 0 ? (
            <div className='text-center text-muted-foreground'>No wallets generated yet. Generate some above!</div>
          ) : (
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
                      {wallet.prefix && <span>Prefix: {wallet.prefix}</span>}
                      {wallet.suffix && <span>Suffix: {wallet.suffix}</span>}
                      {(wallet.prefix || wallet.suffix) && <span>•</span>}
                      <span>{new Date(wallet.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <p className='text-sm font-medium'>{wallet.balance} ETH</p>
                      <Badge variant={wallet.funded ? 'default' : 'secondary'}>
                        {wallet.funded ? 'Funded' : 'Not Funded'}
                      </Badge>
                    </div>
                    <div className='flex gap-2'>
                      <Button variant='outline' size='sm' title='Fund wallet' onClick={() => handleFundWallet(wallet)}>
                        <Send className='h-4 w-4' />
                      </Button>
                      <Button variant='outline' size='sm' title='Send 0 amount' onClick={() => handleSendZeroTx(wallet)}>
                        <Send className='h-4 w-4' />
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
