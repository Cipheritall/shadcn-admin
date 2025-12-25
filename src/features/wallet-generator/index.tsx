import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Key, Download, Copy, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function WalletGenerator() {
  const generatedWallets = [
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
  ]

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
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Suffix (4 chars)</label>
              <input
                type='text'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='BBBB'
                maxLength={4}
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Number of Wallets</label>
              <input
                type='number'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='1'
                defaultValue={1}
                min={1}
                max={100}
              />
            </div>
            <Button className='w-full'>
              <Key className='mr-2 h-4 w-4' />
              Generate Wallets
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
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Private Key</label>
              <input
                type='password'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono'
                placeholder='0x...'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Funding Amount (ETH)</label>
              <input
                type='number'
                step='0.001'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='0.01'
                defaultValue={0.01}
              />
            </div>
            <Button className='w-full' variant='outline'>
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
              <Button variant='outline' size='sm'>
                <Download className='mr-2 h-4 w-4' />
                Export CSV
              </Button>
              <Button variant='outline' size='sm'>
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
                    <Button variant='ghost' size='sm'>
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
                    <Button variant='outline' size='sm' title='Fund wallet'>
                      <Send className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='sm' title='Send 0 amount'>
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
