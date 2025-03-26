-- Create blockchain_networks table
CREATE TABLE IF NOT EXISTS blockchain_networks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    icon_url TEXT,
    is_testnet BOOLEAN DEFAULT FALSE,
    rpc_url TEXT NOT NULL,
    explorer_url TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    gas_price DECIMAL(20, 8),
    block_height BIGINT,
    last_checked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tokens table for tracking cryptocurrency tokens
CREATE TABLE IF NOT EXISTS tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    network_id UUID REFERENCES blockchain_networks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    contract_address TEXT,
    decimals INTEGER NOT NULL DEFAULT 18,
    icon_url TEXT,
    current_price DECIMAL(20, 8),
    price_change_24h DECIMAL(10, 2),
    market_cap DECIMAL(30, 2),
    is_native BOOLEAN DEFAULT FALSE,
    is_enabled BOOLEAN DEFAULT TRUE,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create smart_contracts table
CREATE TABLE IF NOT EXISTS smart_contracts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    network_id UUID REFERENCES blockchain_networks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    type TEXT NOT NULL,
    abi JSONB,
    description TEXT,
    transaction_count INTEGER DEFAULT 0,
    total_gas_used DECIMAL(30, 0) DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    deployed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create network_stats table for historical data
CREATE TABLE IF NOT EXISTS network_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    network_id UUID REFERENCES blockchain_networks(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    gas_price DECIMAL(20, 8),
    transactions_per_second DECIMAL(10, 2),
    block_time_seconds DECIMAL(10, 2),
    active_validators INTEGER,
    network_usage_percentage DECIMAL(5, 2)
);

-- Enable Row Level Security
ALTER TABLE blockchain_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for blockchain_networks
CREATE POLICY "Everyone can view blockchain networks"
    ON blockchain_networks FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify blockchain networks"
    ON blockchain_networks FOR ALL
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

-- Create policies for tokens
CREATE POLICY "Everyone can view tokens"
    ON tokens FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify tokens"
    ON tokens FOR ALL
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

-- Create policies for smart_contracts
CREATE POLICY "Everyone can view smart contracts"
    ON smart_contracts FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify smart contracts"
    ON smart_contracts FOR ALL
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

-- Create policies for network_stats
CREATE POLICY "Everyone can view network stats"
    ON network_stats FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify network stats"
    ON network_stats FOR ALL
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

-- Create update triggers
CREATE TRIGGER update_blockchain_networks_updated_at
    BEFORE UPDATE ON blockchain_networks
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tokens_updated_at
    BEFORE UPDATE ON tokens
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_smart_contracts_updated_at
    BEFORE UPDATE ON smart_contracts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Insert initial blockchain networks
INSERT INTO blockchain_networks (name, symbol, icon_url, is_testnet, rpc_url, explorer_url, status)
VALUES 
('Ethereum', 'ETH', 'https://ethereum.org/favicon.ico', false, 'https://mainnet.infura.io/v3/your-api-key', 'https://etherscan.io', 'active'),
('Binance Smart Chain', 'BNB', 'https://www.binance.org/favicon.ico', false, 'https://bsc-dataseed.binance.org', 'https://bscscan.com', 'active'),
('Polygon', 'MATIC', 'https://polygon.technology/favicon.ico', false, 'https://polygon-rpc.com', 'https://polygonscan.com', 'active'),
('Ethereum Sepolia', 'ETH', 'https://ethereum.org/favicon.ico', true, 'https://sepolia.infura.io/v3/your-api-key', 'https://sepolia.etherscan.io', 'active');

-- Insert initial tokens
INSERT INTO tokens (network_id, name, symbol, decimals, is_native, current_price, price_change_24h)
VALUES 
((SELECT id FROM blockchain_networks WHERE symbol = 'ETH' AND is_testnet = false), 'Ethereum', 'ETH', 18, true, 3500.00, 2.5),
((SELECT id FROM blockchain_networks WHERE symbol = 'BNB' AND is_testnet = false), 'Binance Coin', 'BNB', 18, true, 600.00, 1.8),
((SELECT id FROM blockchain_networks WHERE symbol = 'MATIC' AND is_testnet = false), 'Polygon', 'MATIC', 18, true, 0.80, -0.5);

-- Function to update blockchain network status
CREATE OR REPLACE FUNCTION update_blockchain_network_status(
    p_network_id UUID,
    p_status TEXT,
    p_gas_price DECIMAL,
    p_block_height BIGINT
)
RETURNS VOID AS $$
BEGIN
    UPDATE blockchain_networks
    SET 
        status = p_status,
        gas_price = p_gas_price,
        block_height = p_block_height,
        last_checked_at = NOW()
    WHERE id = p_network_id;
    
    -- Insert a record into network_stats for historical tracking
    INSERT INTO network_stats (network_id, gas_price)
    VALUES (p_network_id, p_gas_price);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
