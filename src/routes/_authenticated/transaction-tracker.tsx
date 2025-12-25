import { createFileRoute } from '@tanstack/react-router'
import TransactionTracker from '@/features/transaction-tracker'

export const Route = createFileRoute('/_authenticated/transaction-tracker')({
  component: TransactionTracker,
})
