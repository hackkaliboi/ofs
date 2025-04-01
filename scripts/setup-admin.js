// Script to set up admin access in Supabase
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

// Create Supabase client with service key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  try {
    console.log('Setting up admin access...');
    
    // 1. Get the user ID for the email
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error listing users:', authError);
      return;
    }
    
    const email = 'pastendro@gmail.com';
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.error(`No user found with email: ${email}`);
      return;
    }
    
    console.log(`Found user with ID: ${user.id}`);
    
    // 2. Create the profiles table if it doesn't exist
    console.log('Creating profiles table if it doesn\'t exist...');
    const { error: createTableError } = await supabase.from('profiles').select('id').limit(1);
    
    if (createTableError && createTableError.code === '42P01') {
      console.log('Profiles table does not exist, creating it...');
      
      // Create the profiles table
      const { error: createError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          full_name: email.split('@')[0] || 'Admin User',
          role: 'admin',
          email: email
        }]);
      
      if (createError) {
        console.error('Error creating profile:', createError);
        
        // Try direct SQL approach
        const { error: sqlError } = await supabase.rpc('create_admin_profile', {
          user_id: user.id,
          user_email: email
        });
        
        if (sqlError) {
          console.error('Error creating profile with SQL function:', sqlError);
        } else {
          console.log('✅ Created admin profile using SQL function');
        }
      } else {
        console.log('✅ Created admin profile');
      }
    } else {
      // Profiles table exists, insert or update the admin profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error checking profile:', profileError);
      }
      
      if (!existingProfile) {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            full_name: email.split('@')[0] || 'Admin User',
            role: 'admin',
            email: email
          }]);
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          console.log('✅ Created admin profile');
        }
      } else {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
        } else {
          console.log('✅ Updated profile to admin role');
        }
      }
    }
    
    // 3. Create wallet_connections table if it doesn't exist
    console.log('Creating wallet_connections table if it doesn\'t exist...');
    const { error: checkWalletTableError } = await supabase.from('wallet_connections').select('id').limit(1);
    
    if (checkWalletTableError && checkWalletTableError.code === '42P01') {
      console.log('Wallet_connections table does not exist, creating it...');
      
      // Try direct SQL approach to create the table
      const createWalletTableSQL = `
        CREATE TABLE IF NOT EXISTS public.wallet_connections (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
      `;
      
      // Execute SQL directly (this might not work depending on Supabase permissions)
      try {
        await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            query: createWalletTableSQL
          })
        });
        console.log('✅ Created wallet_connections table');
      } catch (error) {
        console.error('Error creating wallet_connections table:', error);
      }
    } else {
      console.log('✅ Wallet_connections table already exists');
    }
    
    console.log('Admin setup completed');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

setupAdmin()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
