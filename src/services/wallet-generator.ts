import { supabase, type GeneratedWallet } from '@/lib/supabase'
import { generateWallet, generateVanityAddress, sendTransaction } from '@/lib/blockchain'

/**
 * Generate a new wallet with optional vanity address
 */
export async function createGeneratedWallet(
  prefix?: string,
  suffix?: string
): Promise<GeneratedWallet | null> {
  try {
    let wallet

    if (prefix || suffix) {
      // Generate vanity address
      const vanityWallet = await generateVanityAddress(prefix, suffix, 50000)
      if (!vanityWallet) {
        throw new Error('Could not generate vanity address with given prefix/suffix')
      }
      wallet = vanityWallet
    } else {
      // Generate random wallet
      const randomWallet = generateWallet()
      wallet = {
        address: randomWallet.address,
        privateKey: randomWallet.privateKey,
      }
    }

    // Save to database (without private key for security)
    const { data, error } = await supabase
      .from('generated_wallets')
      .insert({
        address: wallet.address,
        prefix: prefix || null,
        suffix: suffix || null,
        funded: false,
        balance: '0',
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving generated wallet:', error)
      return null
    }

    // Return wallet with private key (only in response, not stored)
    return {
      ...data,
      privateKey: wallet.privateKey,
    } as any
  } catch (error) {
    console.error('Error generating wallet:', error)
    return null
  }
}

/**
 * Get all generated wallets
 */
export async function getGeneratedWallets(): Promise<GeneratedWallet[]> {
  try {
    const { data, error } = await supabase
      .from('generated_wallets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error getting generated wallets:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error getting generated wallets:', error)
    return []
  }
}

/**
 * Fund a generated wallet
 */
export async function fundWallet(
  walletId: string,
  fundingPrivateKey: string,
  toAddress: string,
  amountEth: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const txHash = await sendTransaction(fundingPrivateKey, toAddress, amountEth)

    // Update wallet as funded
    await supabase
      .from('generated_wallets')
      .update({
        funded: true,
        balance: amountEth,
      })
      .eq('id', walletId)

    return {
      success: true,
      txHash,
    }
  } catch (error) {
    console.error('Error funding wallet:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fund wallet',
    }
  }
}

/**
 * Send zero-amount transaction
 */
export async function sendZeroAmountTransaction(
  privateKey: string,
  toAddress: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const txHash = await sendTransaction(privateKey, toAddress, '0')

    return {
      success: true,
      txHash,
    }
  } catch (error) {
    console.error('Error sending zero-amount transaction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send transaction',
    }
  }
}

/**
 * Delete a generated wallet
 */
export async function deleteGeneratedWallet(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('generated_wallets').delete().eq('id', id)

    if (error) {
      console.error('Error deleting generated wallet:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting generated wallet:', error)
    return false
  }
}
