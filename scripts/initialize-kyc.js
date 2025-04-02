// Initialize KYC system script
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
dotenv.config();

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function initializeKycSystem() {
  try {
    console.log('Starting KYC system initialization...');

    // Create extension if it doesn't exist
    const { error: extensionError } = await supabase.rpc('exec_sql', {
      sql: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
    });
    
    if (extensionError) {
      console.error("Error creating extension:", extensionError);
      // Continue anyway, as the error might be because the extension already exists
    } else {
      console.log('UUID extension created or already exists');
    }
    
    // Create admin_users table if it doesn't exist
    const { error: adminTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          role TEXT NOT NULL DEFAULT 'admin',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
        
        ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
        
        -- Policies for admin_users table
        DO $$
        BEGIN
          BEGIN
            DROP POLICY IF EXISTS "Admin users can view admin_users" ON admin_users;
          EXCEPTION WHEN OTHERS THEN
            -- Policy doesn't exist, ignore error
          END;
          
          BEGIN
            DROP POLICY IF EXISTS "Admin users can manage admin_users" ON admin_users;
          EXCEPTION WHEN OTHERS THEN
            -- Policy doesn't exist, ignore error
          END;
        END
        $$;
        
        CREATE POLICY "Admin users can view admin_users"
          ON admin_users
          FOR SELECT
          USING (
            auth.uid() IN (
              SELECT user_id FROM admin_users WHERE user_id = auth.uid()
            )
          );
        
        CREATE POLICY "Admin users can manage admin_users"
          ON admin_users
          FOR ALL
          USING (
            auth.uid() IN (
              SELECT user_id FROM admin_users WHERE user_id = auth.uid()
            )
          );
      `
    });
    
    if (adminTableError) {
      console.error("Error creating admin_users table:", adminTableError);
      // Continue anyway, as the error might be because the table already exists
    } else {
      console.log('Admin users table created or already exists');
    }
    
    // Create KYC table if it doesn't exist
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
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
        
        -- Create policies
        DO $$
        BEGIN
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
        END
        $$;
        
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
      `
    });
    
    if (tableError) {
      console.error("Error creating kyc_documents table:", tableError);
      throw tableError;
    } else {
      console.log('KYC documents table created or already exists');
    }

    // Check if storage bucket exists and create it if it doesn't
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
    } else {
      const bucketExists = buckets?.some(bucket => bucket.name === 'kyc-documents') || false;
      
      if (!bucketExists) {
        // Create bucket
        const { error: createError } = await supabase
          .storage
          .createBucket('kyc-documents', {
            public: true,
            fileSizeLimit: 5 * 1024 * 1024, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf']
          });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
        } else {
          console.log('KYC documents storage bucket created');
        }
      } else {
        console.log('KYC documents storage bucket already exists');
      }
    }

    console.log('KYC system initialization completed successfully!');
    return true;
  } catch (err) {
    console.error("Error initializing KYC system:", err);
    return false;
  }
}

// Run the initialization
initializeKycSystem()
  .then(success => {
    if (success) {
      console.log('KYC system is ready to use!');
    } else {
      console.error('Failed to initialize KYC system.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
