import { createFileRoute } from '@tanstack/react-router'
import BlockScanner from '@/features/block-scanner'

export const Route = createFileRoute('/_authenticated/block-scanner')({
  component: BlockScanner,
})
