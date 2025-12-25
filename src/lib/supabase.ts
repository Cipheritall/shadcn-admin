import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface MonitoredWallet {
  id: string
  address: string
  label: string
  created_at: string
  updated_at: string
  user_id?: string
}

export interface Transaction {
  id: string
  hash: string
  from_address: string
  to_address: string
  value: string
  block_number: number
  timestamp: string
  gas_price?: string
  gas_used?: string
  status: string
  created_at: string
}

export interface HighValueWallet {
  id: string
  address: string
  first_seen_block: number
  total_value: string
  transaction_count: number
  last_transaction: string
  created_at: string
}

export interface GeneratedWallet {
  id: string
  address: string
  prefix?: string
  suffix?: string
  funded: boolean
  balance: string
  created_at: string
  user_id?: string
}
