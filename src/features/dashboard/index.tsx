import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Scan, Wallet, BarChart3, Key, ArrowUpDown } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6 flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Mimix Dashboard</h1>
            <p className='text-muted-foreground'>
              Blockchain wallet monitoring and management platform
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Monitored Wallets</CardTitle>
              <Wallet className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>24</div>
              <p className='text-xs text-muted-foreground'>+3 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Balance</CardTitle>
              <BarChart3 className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>10,599.90 ETH</div>
              <p className='text-xs text-muted-foreground'>Across all wallets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Transactions (24h)</CardTitle>
              <ArrowUpDown className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>99</div>
              <p className='text-xs text-muted-foreground'>+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Generated Wallets</CardTitle>
              <Key className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>12</div>
              <p className='text-xs text-muted-foreground'>5 funded</p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
          <Link to='/block-scanner'>
            <Card className='cursor-pointer transition-colors hover:bg-accent'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                    <Scan className='h-6 w-6 text-primary' />
                  </div>
                  <div>
                    <CardTitle>Block Scanner</CardTitle>
                    <CardDescription>Scan blocks for high-value wallets</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  Scan the latest blocks and retrieve wallets with high-value transactions.
                  Configure scanning parameters and export results.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to='/wallet-monitor'>
            <Card className='cursor-pointer transition-colors hover:bg-accent'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                    <Wallet className='h-6 w-6 text-primary' />
                  </div>
                  <div>
                    <CardTitle>Wallet Monitor</CardTitle>
                    <CardDescription>Track wallet transactions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  Monitor specific wallets for incoming and outgoing transactions in real-time.
                  Get alerts for high-value movements.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to='/transaction-tracker'>
            <Card className='cursor-pointer transition-colors hover:bg-accent'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                    <Key className='h-6 w-6 text-primary' />
                  </div>
                  <div>
                    <CardTitle>Transaction Tracker</CardTitle>
                    <CardDescription>Analyze transaction patterns</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  Track high-value transactions and group receivers by sender wallets.
                  Export detailed analysis for further review.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to='/wallet-generator'>
            <Card className='cursor-pointer transition-colors hover:bg-accent'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                    <ArrowUpDown className='h-6 w-6 text-primary' />
                  </div>
                  <div>
                    <CardTitle>Wallet Generator</CardTitle>
                    <CardDescription>Generate custom wallets</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  Generate wallets with custom prefix/suffix patterns. Fund wallets and manage
                  private keys securely.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard',
    isActive: true,
  },
  {
    title: 'Block Scanner',
    href: 'block-scanner',
    isActive: false,
  },
  {
    title: 'Wallet Monitor',
    href: 'wallet-monitor',
    isActive: false,
  },
  {
    title: 'Transaction Tracker',
    href: 'transaction-tracker',
    isActive: false,
  },
  {
    title: 'Wallet Generator',
    href: 'wallet-generator',
    isActive: false,
  },
]
