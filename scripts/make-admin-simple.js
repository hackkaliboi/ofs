// Simple script to make a user an admin in Supabase
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

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

async function makeUserAdmin(email) {
  try {
    console.log(`Attempting to make ${email} an admin...`);
    
    // First check if the user exists in auth
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
      
      // Create admin profile for new user
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{
          id: newUser.user.id,
          full_name: email.split('@')[0] || 'Admin User',
          avatar_url: null,
          role: 'admin',
          email: email
        }]);
      
      if (insertError) {
        console.error('Error creating profile:', insertError);
        return;
      }
      
      console.log(`✅ Created new admin profile for ${email}`);
      console.log(`✅ Temporary password: Password123!`);
      console.log(`✅ Please change this password after first login`);
      
    } else {
      console.log(`Found user with ID: ${user.id}`);
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error checking profile:', profileError);
        return;
      }
      
      if (!profile) {
        console.log('No profile found, creating new admin profile...');
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            full_name: email.split('@')[0] || 'Admin User',
            avatar_url: null,
            role: 'admin',
            email: email
          }]);
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          return;
        }
        
        console.log(`✅ Created new admin profile for ${email}`);
      } else {
        console.log('Profile found, updating to admin role...');
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
          return;
        }
        
        console.log(`✅ Updated ${email} to admin role`);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address: node make-admin-simple.js your-email@example.com');
  process.exit(1);
}

makeUserAdmin(email)
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
