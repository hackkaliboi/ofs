// Script to make a user an admin in Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

// Create Supabase client with service key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function makeUserAdmin(email) {
  try {
    // First, get the user's ID from their email
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);
    
    if (userError) {
      console.error('Error finding user:', userError);
      return;
    }
    
    if (!users || users.length === 0) {
      // Try to find the user in the auth.users table
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error listing users:', authError);
        return;
      }
      
      const user = authUsers.users.find(u => u.email === email);
      
      if (!user) {
        console.error(`No user found with email: ${email}`);
        return;
      }
      
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
        
        console.log(`Created new admin profile for ${email}`);
      } else {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
          return;
        }
        
        console.log(`Updated ${email} to admin role`);
      }
    } else {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', users[0].id);
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
        return;
      }
      
      console.log(`Updated ${email} to admin role`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address: node make-admin.js your-email@example.com');
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
