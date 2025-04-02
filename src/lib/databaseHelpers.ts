import { supabase } from './supabaseClient';

/**
 * Checks if a table exists in the database
 * @param tableName The name of the table to check
 * @returns Boolean indicating if the table exists
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    // Try a simple query to see if the table exists
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (!error) {
      return true;
    }
    
    // If there was an error, check if it's because the table doesn't exist
    if (error.message.includes('does not exist')) {
      return false;
    }
    
    // For other errors, log and return false
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err);
    return false;
  }
}

/**
 * Creates the user_activity_log table if it doesn't exist
 */
export async function ensureUserActivityTable(): Promise<boolean> {
  try {
    const exists = await tableExists('user_activity_log');
    if (exists) return true;
    
    // Try to create the table
    try {
      await supabase.from('user_activity_log').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        activity_type: 'system_init',
        description: 'Table initialization'
      });
      return true;
    } catch (e) {
      console.error('Failed to create user_activity_log table:', e);
      return false;
    }
  } catch (err) {
    console.error('Error ensuring user_activity_log table exists:', err);
    return false;
  }
}

/**
 * Creates the wallet_connections table if it doesn't exist
 */
export async function ensureWalletConnectionsTable(): Promise<boolean> {
  try {
    const exists = await tableExists('wallet_connections');
    if (exists) return true;
    
    // Try to create the table
    try {
      await supabase.from('wallet_connections').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        wallet_address: '0x0000000000000000000000000000000000000000'
      });
      return true;
    } catch (e) {
      console.error('Failed to create wallet_connections table:', e);
      return false;
    }
  } catch (err) {
    console.error('Error ensuring wallet_connections table exists:', err);
    return false;
  }
}

/**
 * Creates the security_events table if it doesn't exist
 */
export async function ensureSecurityEventsTable(): Promise<boolean> {
  try {
    const exists = await tableExists('security_events');
    if (exists) return true;
    
    // Try to create the table
    try {
      await supabase.from('security_events').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        event_type: 'system_init',
        description: 'Table initialization',
        severity: 'info'
      });
      return true;
    } catch (e) {
      console.error('Failed to create security_events table:', e);
      return false;
    }
  } catch (err) {
    console.error('Error ensuring security_events table exists:', err);
    return false;
  }
}

/**
 * Creates the admin_users table if it doesn't exist
 */
export async function ensureAdminUsersTable(): Promise<boolean> {
  try {
    const exists = await tableExists('admin_users');
    if (exists) return true;
    
    // Try to create the table
    try {
      await supabase.from('admin_users').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        role: 'admin'
      });
      return true;
    } catch (e) {
      console.error('Failed to create admin_users table:', e);
      return false;
    }
  } catch (err) {
    console.error('Error ensuring admin_users table exists:', err);
    return false;
  }
}

/**
 * Creates the kyc_documents table if it doesn't exist
 */
export async function ensureKycDocumentsTable(): Promise<boolean> {
  try {
    const exists = await tableExists('kyc_documents');
    if (exists) return true;
    
    // Create the table using SQL
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS kyc_documents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        document_type TEXT NOT NULL,
        document_number TEXT NOT NULL,
        front_image_url TEXT NOT NULL,
        back_image_url TEXT,
        selfie_image_url TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        submitted_at TIMESTAMPTZ NOT NULL,
        reviewed_at TIMESTAMPTZ,
        reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        rejection_reason TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
      CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON kyc_documents(status);
      
      ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
      
      DO $$
      BEGIN
        -- Drop policies if they exist (to avoid errors when recreating)
        BEGIN
          DROP POLICY IF EXISTS "Users can view their own KYC documents" ON kyc_documents;
        EXCEPTION WHEN OTHERS THEN
          -- Policy doesn't exist, ignore error
        END;
        
        BEGIN
          DROP POLICY IF EXISTS "Users can insert their own KYC documents" ON kyc_documents;
        EXCEPTION WHEN OTHERS THEN
          -- Policy doesn't exist, ignore error
        END;
        
        BEGIN
          DROP POLICY IF EXISTS "Admin users can view all KYC documents" ON kyc_documents;
        EXCEPTION WHEN OTHERS THEN
          -- Policy doesn't exist, ignore error
        END;
        
        BEGIN
          DROP POLICY IF EXISTS "Admin users can update KYC documents" ON kyc_documents;
        EXCEPTION WHEN OTHERS THEN
          -- Policy doesn't exist, ignore error
        END;
      END $$;
      
      -- Create policies
      CREATE POLICY "Users can view their own KYC documents"
        ON kyc_documents
        FOR SELECT
        USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can insert their own KYC documents"
        ON kyc_documents
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Admin users can view all KYC documents"
        ON kyc_documents
        FOR SELECT
        USING (
          auth.uid() IN (
            SELECT user_id FROM admin_users WHERE user_id = auth.uid()
          )
        );
      
      CREATE POLICY "Admin users can update KYC documents"
        ON kyc_documents
        FOR UPDATE
        USING (
          auth.uid() IN (
            SELECT user_id FROM admin_users WHERE user_id = auth.uid()
          )
        );
    `;
    
    try {
      // Execute the SQL directly
      const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
      
      if (error) {
        console.error('Error creating kyc_documents table:', error);
        return false;
      }
      
      return true;
    } catch (e) {
      console.error('Failed to create kyc_documents table:', e);
      return false;
    }
  } catch (err) {
    console.error('Error ensuring kyc_documents table exists:', err);
    return false;
  }
}

/**
 * Ensures the KYC documents storage bucket exists
 */
export async function ensureKycStorageBucket(): Promise<boolean> {
  try {
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error listing storage buckets:', bucketsError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'kyc-documents');
    
    if (bucketExists) {
      return true;
    }
    
    // Create the bucket
    const { error: createError } = await supabase
      .storage
      .createBucket('kyc-documents', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf']
      });
    
    if (createError) {
      // If we get a "bucket already exists" error, that's fine
      if (createError.message.includes('already exists')) {
        return true;
      }
      
      console.error('Error creating KYC storage bucket:', createError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error ensuring KYC storage bucket exists:', err);
    return false;
  }
}

/**
 * Creates sample data for testing
 * @param userId The user ID to create sample data for
 */
export async function createSampleData(userId: string): Promise<void> {
  try {
    // Check if user already has activity data
    const { data: existingActivity } = await supabase
      .from('user_activity_log')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
      
    if (!existingActivity || existingActivity.length === 0) {
      // Create sample user activity
      try {
        await supabase.from('user_activity_log').insert([
          {
            user_id: userId,
            activity_type: 'user_login',
            description: 'User logged in successfully'
          },
          {
            user_id: userId,
            activity_type: 'profile_updated',
            description: 'User profile information updated'
          }
        ]);
      } catch (e) {
        console.error('Error creating sample activity data:', e);
      }
    }
    
    // Check if user already has wallet connections
    const { data: existingWallets } = await supabase
      .from('wallet_connections')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
      
    if (!existingWallets || existingWallets.length === 0) {
      // Create sample wallet connections
      try {
        await supabase.from('wallet_connections').insert([
          {
            user_id: userId,
            wallet_address: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
            chain_type: 'Ethereum',
            validated: true,
            validation_status: 'validated',
            validated_at: new Date().toISOString()
          },
          {
            user_id: userId,
            wallet_address: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
            chain_type: 'Binance Smart Chain',
            validated: false,
            validation_status: 'pending'
          }
        ]);
      } catch (e) {
        console.error('Error creating sample wallet data:', e);
      }
    }
    
    // Check if there are security events
    const { data: existingSecurityEvents } = await supabase
      .from('security_events')
      .select('id')
      .limit(1);
      
    if (!existingSecurityEvents || existingSecurityEvents.length === 0) {
      // Create sample security events
      try {
        await supabase.from('security_events').insert([
          {
            user_id: userId,
            event_type: 'login_success',
            description: 'Successful login from new device',
            severity: 'info',
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          {
            user_id: userId,
            event_type: 'password_changed',
            description: 'User changed their password',
            severity: 'info',
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        ]);
      } catch (e) {
        console.error('Error creating sample security events:', e);
      }
    }
    
    // Check if user is an admin
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
      
    // Make the first user an admin if no admins exist
    if (!existingAdmin || existingAdmin.length === 0) {
      const { data: adminCount } = await supabase
        .from('admin_users')
        .select('id')
        .limit(1);
        
      if (!adminCount || adminCount.length === 0) {
        try {
          await supabase.from('admin_users').insert({
            user_id: userId,
            role: 'admin'
          });
        } catch (e) {
          console.error('Error creating admin user:', e);
        }
      }
    }
  } catch (err) {
    console.error('Error creating sample data:', err);
  }
}

/**
 * Ensures all required tables exist and creates sample data if needed
 * @param userId The user ID to initialize for
 */
export async function initializeDatabase(userId: string): Promise<boolean> {
  try {
    // Ensure all required tables exist
    const userActivityTable = await ensureUserActivityTable();
    const walletConnectionsTable = await ensureWalletConnectionsTable();
    const securityEventsTable = await ensureSecurityEventsTable();
    const adminUsersTable = await ensureAdminUsersTable();
    const kycDocumentsTable = await ensureKycDocumentsTable();
    const kycStorageBucket = await ensureKycStorageBucket();
    
    // Create sample data for the user
    await createSampleData(userId);
    
    return userActivityTable && walletConnectionsTable && securityEventsTable && adminUsersTable && kycDocumentsTable && kycStorageBucket;
  } catch (err) {
    console.error('Error initializing database:', err);
    return false;
  }
}
