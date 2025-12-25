import { createFileRoute } from '@tanstack/react-router'
import WalletGenerator from '@/features/wallet-generator'

export const Route = createFileRoute('/_authenticated/wallet-generator')({
  component: WalletGenerator,
})
