/**
 * Utility functions for exporting data to CSV format
 */

export interface CSVExportOptions {
  filename: string
  headers?: string[]
  data: Record<string, any>[]
}

/**
 * Convert data to CSV format and trigger download
 */
export function exportToCSV(options: CSVExportOptions): void {
  const { filename, headers, data } = options

  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Get headers from data keys if not provided
  const csvHeaders = headers || Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    // Headers
    csvHeaders.join(','),
    // Data rows
    ...data.map((row) =>
      csvHeaders.map((header) => {
        const value = row[header]
        // Handle values that contain commas, quotes, or newlines
        if (
          value &&
          (value.toString().includes(',') ||
            value.toString().includes('"') ||
            value.toString().includes('\n'))
        ) {
          return `"${value.toString().replace(/"/g, '""')}"`
        }
        return value ?? ''
      }).join(',')
    ),
  ].join('\n')

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Export wallet data with private keys
 */
export function exportWallets(
  wallets: Array<{
    address: string
    privateKey?: string
    prefix?: string
    suffix?: string
    balance?: string
    createdAt?: string
  }>
): void {
  exportToCSV({
    filename: `mimix-wallets-${new Date().toISOString().split('T')[0]}.csv`,
    headers: ['Address', 'Private Key', 'Prefix', 'Suffix', 'Balance', 'Created At'],
    data: wallets.map((wallet) => ({
      Address: wallet.address,
      'Private Key': wallet.privateKey || '',
      Prefix: wallet.prefix || '',
      Suffix: wallet.suffix || '',
      Balance: wallet.balance || '0',
      'Created At': wallet.createdAt || '',
    })),
  })
}

/**
 * Export transaction data
 */
export function exportTransactions(
  transactions: Array<{
    from: string
    to: string
    amount: string
    timestamp: string
    blockNumber: number
    type?: string
  }>
): void {
  exportToCSV({
    filename: `mimix-transactions-${new Date().toISOString().split('T')[0]}.csv`,
    headers: ['From', 'To', 'Amount', 'Timestamp', 'Block Number', 'Type'],
    data: transactions.map((tx) => ({
      From: tx.from,
      To: tx.to,
      Amount: tx.amount,
      Timestamp: tx.timestamp,
      'Block Number': tx.blockNumber,
      Type: tx.type || '',
    })),
  })
}

/**
 * Export monitored wallets
 */
export function exportMonitoredWallets(
  wallets: Array<{
    address: string
    label: string
    balance: string
    incomingTx: number
    outgoingTx: number
    lastActivity: string
    status: string
  }>
): void {
  exportToCSV({
    filename: `mimix-monitored-wallets-${new Date().toISOString().split('T')[0]}.csv`,
    headers: [
      'Address',
      'Label',
      'Balance',
      'Incoming Tx',
      'Outgoing Tx',
      'Last Activity',
      'Status',
    ],
    data: wallets.map((wallet) => ({
      Address: wallet.address,
      Label: wallet.label,
      Balance: wallet.balance,
      'Incoming Tx': wallet.incomingTx,
      'Outgoing Tx': wallet.outgoingTx,
      'Last Activity': wallet.lastActivity,
      Status: wallet.status,
    })),
  })
}
