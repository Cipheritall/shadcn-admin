-- Mimix Dashboard Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Monitored Wallets Table
CREATE TABLE IF NOT EXISTS monitored_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address VARCHAR(42) NOT NULL UNIQUE,
    label VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_monitored_wallets_address ON monitored_wallets(address);
CREATE INDEX idx_monitored_wallets_user_id ON monitored_wallets(user_id);

-- High Value Wallets Table
CREATE TABLE IF NOT EXISTS high_value_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address VARCHAR(42) NOT NULL UNIQUE,
    first_seen_block INTEGER NOT NULL,
    total_value VARCHAR(50) NOT NULL,
    transaction_count INTEGER DEFAULT 0,
    last_transaction TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_high_value_wallets_address ON high_value_wallets(address);
CREATE INDEX idx_high_value_wallets_value ON high_value_wallets(total_value);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hash VARCHAR(66) NOT NULL UNIQUE,
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42) NOT NULL,
    value VARCHAR(50) NOT NULL,
    block_number INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    gas_price VARCHAR(50),
    gas_used VARCHAR(50),
    status VARCHAR(20) DEFAULT 'success',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_hash ON transactions(hash);
CREATE INDEX idx_transactions_from ON transactions(from_address);
CREATE INDEX idx_transactions_to ON transactions(to_address);
CREATE INDEX idx_transactions_block ON transactions(block_number);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX idx_transactions_value ON transactions(value);

-- Generated Wallets Table
CREATE TABLE IF NOT EXISTS generated_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address VARCHAR(42) NOT NULL UNIQUE,
    prefix VARCHAR(10),
    suffix VARCHAR(10),
    funded BOOLEAN DEFAULT FALSE,
    balance VARCHAR(50) DEFAULT '0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_generated_wallets_address ON generated_wallets(address);
CREATE INDEX idx_generated_wallets_user_id ON generated_wallets(user_id);
CREATE INDEX idx_generated_wallets_funded ON generated_wallets(funded);

-- Scan History Table (optional - to track scan operations)
CREATE TABLE IF NOT EXISTS scan_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_block INTEGER NOT NULL,
    end_block INTEGER NOT NULL,
    blocks_scanned INTEGER NOT NULL,
    wallets_found INTEGER DEFAULT 0,
    min_value VARCHAR(50) NOT NULL,
    scan_duration INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_scan_history_created_at ON scan_history(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to monitored_wallets
CREATE TRIGGER update_monitored_wallets_updated_at
    BEFORE UPDATE ON monitored_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS
ALTER TABLE monitored_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

-- Public tables (no RLS needed for demo)
ALTER TABLE high_value_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Allow public read access for demo purposes
CREATE POLICY "Allow public read access on high_value_wallets" 
    ON high_value_wallets FOR SELECT 
    USING (true);

CREATE POLICY "Allow public read access on transactions" 
    ON transactions FOR SELECT 
    USING (true);

-- For authenticated users
CREATE POLICY "Users can view their own monitored wallets" 
    ON monitored_wallets FOR SELECT 
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own monitored wallets" 
    ON monitored_wallets FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own monitored wallets" 
    ON monitored_wallets FOR UPDATE 
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own monitored wallets" 
    ON monitored_wallets FOR DELETE 
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Similar policies for generated_wallets
CREATE POLICY "Users can view their own generated wallets" 
    ON generated_wallets FOR SELECT 
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own generated wallets" 
    ON generated_wallets FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own generated wallets" 
    ON generated_wallets FOR DELETE 
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow anonymous/public operations for demo (optional - remove in production)
CREATE POLICY "Allow anonymous insert on monitored_wallets" 
    ON monitored_wallets FOR INSERT 
    WITH CHECK (user_id IS NULL);

CREATE POLICY "Allow anonymous insert on generated_wallets" 
    ON generated_wallets FOR INSERT 
    WITH CHECK (user_id IS NULL);

CREATE POLICY "Allow public insert on high_value_wallets" 
    ON high_value_wallets FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public upsert on high_value_wallets" 
    ON high_value_wallets FOR UPDATE 
    USING (true);

CREATE POLICY "Allow public insert on transactions" 
    ON transactions FOR INSERT 
    WITH CHECK (true);

-- Create a function to clean old data (optional)
CREATE OR REPLACE FUNCTION clean_old_transactions(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM transactions 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE monitored_wallets IS 'Stores wallet addresses that users want to monitor';
COMMENT ON TABLE high_value_wallets IS 'Stores wallets discovered during block scans with high-value transactions';
COMMENT ON TABLE transactions IS 'Stores transaction data for tracked wallets';
COMMENT ON TABLE generated_wallets IS 'Stores wallets generated by users (without private keys)';
COMMENT ON TABLE scan_history IS 'Tracks block scanning operations';
