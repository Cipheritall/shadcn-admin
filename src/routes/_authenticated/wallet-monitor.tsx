import { createFileRoute } from '@tanstack/react-router'
import WalletMonitor from '@/features/wallet-monitor'

export const Route = createFileRoute('/_authenticated/wallet-monitor')({
  component: WalletMonitor,
})
