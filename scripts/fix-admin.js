// Script to fix admin access
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

// Create Supabase client with service key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAdminAccess() {
  try {
    console.log('Starting admin access fix...');
    
    // Get the user ID for the email
    const email = 'pastendro@gmail.com';
    console.log(`Finding user with email: ${email}...`);
    
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error listing users:', authError);
      return;
    }
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.error(`No user found with email: ${email}`);
      return;
    }
    
    console.log(`Found user with ID: ${user.id}`);
    
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileError);
    }
    
    if (!profile) {
      console.log('No profile found, creating new admin profile...');
      // Create profile if it doesn't exist
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: 'Admin User',
          role: 'admin',
          email: email
        });
      
      if (insertError) {
        console.error('Error creating profile:', insertError);
      } else {
        console.log(`✅ Created admin profile for ${email}`);
      }
    } else {
      console.log('Profile found, updating to admin role...');
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
      } else {
        console.log(`✅ Updated ${email} to admin role`);
      }
    }
    
    console.log('Admin access fix completed');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixAdminAccess()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
