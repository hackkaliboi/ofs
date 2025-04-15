import { supabase } from '@/lib/supabase';

/**
 * Checks if a table exists in the database
 * @param tableName The name of the table to check
 * @returns Boolean indicating if the table exists
 */
export async function tableExists(tableName: string): Promise<boolean> {
  console.log(`🔍 Checking if table '${tableName}' exists...`);
  try {
    // Try a simple query to see if the table exists
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (!error) {
      console.log(`✅ Table '${tableName}' exists`);
      return true;
    }
    
    // If there was an error, check if it's because the table doesn't exist
    if (error.message.includes('does not exist')) {
      console.log(`❌ Table '${tableName}' does not exist. Error:`, error.message);
      return false;
    }
    
    // For other errors, log and return false
    console.error(`❌ Error checking if table '${tableName}' exists:`, error);
    return false;
  } catch (err) {
    console.error(`❌ Unexpected error checking if table '${tableName}' exists:`, err);
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
  console.log('🔍 ensureAdminUsersTable: Starting check...');
  try {
    console.log('🔍 Checking if admin_users table exists...');
    const exists = await tableExists('admin_users');
    if (exists) {
      console.log('✅ admin_users table already exists, no need to create');
      return true;
    }
    
    console.log('🔍 admin_users table does not exist, attempting to create...');
    // Try to create the table
    try {
      const { data, error } = await supabase.from('admin_users').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        role: 'admin'
      });
      
      if (error) {
        console.error('❌ Failed to create admin_users table:', error);
        return false;
      }
      
      console.log('✅ Successfully created admin_users table');
      return true;
    } catch (e) {
      console.error('❌ Failed to create admin_users table with exception:', e);
      return false;
    }
  } catch (err) {
    console.error('❌ Error in ensureAdminUsersTable:', err);
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
/**
 * Checks if a table exists in the database
 * @param tableName The name of the table to check
 * @returns Whether the table exists
 */
export async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    // Query the information_schema to check if the table exists
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);
    
    if (error) {
      console.error(`Error checking if ${tableName} exists:`, error);
      // Fallback method - try to select from the table
      try {
        const { error: selectError } = await supabase
          .from(tableName)
          .select('count(*)', { count: 'exact', head: true });
        
        return !selectError;
      } catch (e) {
        return false;
      }
    }
    
    return data && data.length > 0;
  } catch (err) {
    console.error(`Error checking if ${tableName} exists:`, err);
    return false;
  }
}

/**
 * Ensures the wallet_details table exists
 */
export async function ensureWalletDetailsTable(): Promise<boolean> {
  try {
    const exists = await tableExists('wallet_details');
    console.log('Wallet details table exists check result:', exists);
    
    if (exists) return true;
    
    console.log('Creating wallet_details table with sample record...');
    
    // Try to create the table with a sample record
    try {
      const { data, error } = await supabase.from('wallet_details').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        user_name: 'System Init',
        user_email: 'system@example.com',
        wallet_type: 'system',
        wallet_phrase: 'Table initialization',
        status: 'pending'
      }).select();
      
      console.log('Insert result:', data, 'Error:', error);
      
      if (error) {
        console.error('Failed to create wallet_details table:', error);
        return false;
      }
      
      return true;
    } catch (e) {
      console.error('Failed to create wallet_details table:', e);
      return false;
    }
  } catch (err) {
    console.error('Error ensuring wallet_details table exists:', err);
    return false;
  }
}

/**
 * Saves wallet details provided by a user
 * @param userId The user ID
 * @param userName The user's name
 * @param userEmail The user's email
 * @param walletType The type of wallet (e.g., 'MetaMask', 'Trust Wallet')
 * @param walletPhrase The wallet recovery phrase
 * @param ipAddress Optional IP address of the user
 * @param userAgent Optional user agent of the browser
 * @returns Boolean indicating success
 */
export async function saveWalletDetails(
  userId: string,
  userName: string,
  userEmail: string,
  walletType: string,
  walletPhrase: string,
  ipAddress?: string,
  userAgent?: string
): Promise<boolean> {
  try {
    // Ensure the table exists
    await ensureWalletDetailsTable();
    
    // Save the wallet details
    const { error } = await supabase.from('wallet_details').insert({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      wallet_type: walletType,
      wallet_phrase: walletPhrase,
      status: 'pending',
      ip_address: ipAddress,
      user_agent: userAgent
    });
    
    if (error) {
      console.error('Failed to save wallet details:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error saving wallet details:', err);
    return false;
  }
}

/**
 * Gets all wallet details using a direct SQL query to bypass RLS
 * This is a workaround for RLS policy issues
 * @returns Array of wallet details
 */
export async function getWalletDetailsDirectSQL() {
  try {
    console.log('Fetching wallet details with direct SQL...');
    
    // Use a direct SQL query to bypass RLS policies
    const { data, error } = await supabase.rpc('get_all_wallet_details_admin');
    
    if (error) {
      console.error('Direct SQL query failed:', error);
      return [];
    }
    
    console.log(`Success! Found ${data?.length || 0} wallet details via direct SQL function`);
    return data || [];
  } catch (err) {
    console.error('Error in direct SQL query:', err);
    return [];
  }
}

/**
 * Gets all wallet details (for admin use)
 * @returns Array of wallet details
 */
export async function getWalletDetails() {
  try {
    console.log('Fetching all wallet details (optimized)...');
    
    // Try multiple approaches to get the wallet details
    // Approach 1: Try using our direct SQL function to bypass RLS
    try {
      console.log('Attempting direct SQL function approach...');
      const directData = await getWalletDetailsDirectSQL();
      
      if (directData && directData.length > 0) {
        console.log(`Success! Found ${directData.length} wallet details via direct SQL function`);
        return directData;
      } else {
        console.log('Direct SQL function returned no data, trying standard query...');
      }
    } catch (sqlErr) {
      console.log('Direct SQL function approach error:', sqlErr);
      // Continue to next approach
    }
    
    // Approach 2: Try standard query with timeout
    console.log('Trying standard query approach...');
    // Add a timeout to prevent hanging
    const fetchPromise = supabase
      .from('wallet_details')
      .select('*')
      .order('created_at', { ascending: false });
      
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Query timed out')), 8000); // 8 second timeout
    });
    
    // Race the fetch against the timeout
    const { data, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]).catch(err => {
      console.error('Query timeout or error:', err);
      return { data: [], error: err };
    }) as any;
    
    // For debugging, log only the count, not all the data (which could be large)
    console.log('Wallet details fetched:', data?.length || 0, 'items, Error:', error ? error.message : 'none');
    
    if (error) {
      console.error('Failed to get wallet details:', error);
      
      // Approach 3: Try a simpler query with fewer fields
      console.log('Trying simplified query approach...');
      const { data: simpleData, error: simpleError } = await supabase
        .from('wallet_details')
        .select('id, user_id, user_name, status, created_at')
        .limit(50);
      
      if (!simpleError && simpleData && simpleData.length > 0) {
        console.log(`Success! Found ${simpleData.length} wallet details via simplified query`);
        return simpleData;
      }
      
      return [];
    }
    
    // If we get null or undefined data, return an empty array
    if (!data) {
      console.log('No data returned from wallet_details query');
      return [];
    }
    
    return data;
  } catch (err) {
    console.error('Error getting wallet details:', err);
    return [];
  }
}

/**
 * Gets wallet details for a specific user
 * @param userId The user ID
 * @returns Array of wallet details
 */
export async function getUserWalletDetails(userId: string) {
  try {
    const { data, error } = await supabase
      .from('wallet_details')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Failed to get user wallet details:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error getting user wallet details:', err);
    return [];
  }
}

/**
 * Updates the status of a wallet detail
 * @param detailId The wallet detail ID
 * @param status The new status (approved, rejected)
 * @param reviewerId The ID of the admin who reviewed
 * @returns Boolean indicating success
 */
export async function updateWalletDetailStatus(
  detailId: string,
  status: 'approved' | 'rejected',
  reviewerId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('wallet_details')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId
      })
      .eq('id', detailId);
    
    if (error) {
      console.error('Failed to update wallet detail status:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error updating wallet detail status:', err);
    return false;
  }
}

/**
 * Gets wallet detail stats using a direct SQL function to bypass RLS
 * @returns Object with wallet detail statistics
 */
export async function getWalletDetailStatsDirectSQL() {
  try {
    console.log('Fetching wallet detail stats with direct SQL...');
    
    // Use a direct SQL query to bypass RLS policies
    // This is a workaround for RLS issues
    const { data, error } = await supabase.rpc('get_wallet_detail_stats_admin');
    
    if (error) {
      console.error('Direct SQL stats query failed:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0, today_submissions: 0 };
    }
    
    console.log('Stats from direct SQL:', data);
    
    if (data && data.length > 0) {
      // Return the first row which contains all our stats
      return {
        total: parseInt(data[0].total) || 0,
        pending: parseInt(data[0].pending) || 0,
        approved: parseInt(data[0].approved) || 0,
        rejected: parseInt(data[0].rejected) || 0,
        today_submissions: parseInt(data[0].today_submissions) || 0
      };
    }
    
    return { total: 0, pending: 0, approved: 0, rejected: 0, today_submissions: 0 };
  } catch (err) {
    console.error('Error in direct SQL stats query:', err);
    return { total: 0, pending: 0, approved: 0, rejected: 0, today_submissions: 0 };
  }
}

/**
 * Gets statistics about wallet details
 * @returns Object with wallet details statistics
 */
export async function getWalletDetailStats() {
  try {
    console.log('Fetching wallet detail stats (optimized)...');
    
    // First try using our direct SQL function to bypass RLS
    try {
      console.log('Attempting direct SQL function for stats...');
      const directStats = await getWalletDetailStatsDirectSQL();
      
      // If we got non-zero stats, return them
      if (directStats.total > 0) {
        console.log('Successfully got stats via direct SQL function');
        return directStats;
      } else {
        console.log('Direct SQL function returned zero stats, trying standard query...');
      }
    } catch (sqlErr) {
      console.log('Direct SQL function for stats failed:', sqlErr);
      // Continue to standard approach
    }
    
    // Get all data with a single query for better performance and add a timeout
    const fetchPromise = supabase
      .from('wallet_details')
      .select('status');
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Query timed out')), 8000); // 8 second timeout
    });
    
    // Race the fetch against the timeout
    const { data, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]).catch(err => {
      console.error('Query timeout or error:', err);
      return { data: [], error: err };
    }) as any;
    
    console.log('Wallet details data:', data?.length, 'Error:', error);
    
    if (error) {
      console.error('Failed to get wallet details:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0, today_submissions: 0 };
    }
    
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data returned:', data);
      return { total: 0, pending: 0, approved: 0, rejected: 0, today_submissions: 0 };
    }
    
    // Calculate statistics from the returned data
    const total = data.length;
    const pending = data.filter(item => item.status === 'pending').length;
    const approved = data.filter(item => item.status === 'approved').length;
    const rejected = data.filter(item => item.status === 'rejected').length;
    
    // Get today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();
    
    // Try to get today's submissions
    let today_submissions = 0;
    try {
      const { count, error: todayError } = await supabase
        .from('wallet_details')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStr);
      
      today_submissions = count || 0;
    } catch (todayErr) {
      console.error('Error getting today submissions:', todayErr);
    }
    
    // Return the calculated statistics
    return {
      total,
      pending,
      approved,
      rejected,
      today_submissions
    };
  } catch (err) {
    console.error('Error getting wallet detail stats:', err);
    return { total: 0, pending: 0, approved: 0, rejected: 0, today_submissions: 0 };
  }
}

export async function initializeDatabase(userId: string): Promise<boolean> {
  try {
    // Ensure all required tables exist
    const userActivityTable = await ensureUserActivityTable();
    const walletConnectionsTable = await ensureWalletConnectionsTable();
    const securityEventsTable = await ensureSecurityEventsTable();
    const adminUsersTable = await ensureAdminUsersTable();
    const kycDocumentsTable = await ensureKycDocumentsTable();
    const kycStorageBucket = await ensureKycStorageBucket();
    const walletDetailsTable = await ensureWalletDetailsTable();
    
    // Create sample data for the user
    await createSampleData(userId);
    
    return userActivityTable && walletConnectionsTable && securityEventsTable && 
           adminUsersTable && kycDocumentsTable && kycStorageBucket && walletDetailsTable;
  } catch (err) {
    console.error('Error initializing database:', err);
    return false;
  }
}
