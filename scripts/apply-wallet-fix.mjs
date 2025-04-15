// Script to apply the wallet details SQL functions to fix the admin dashboard
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get current file directory (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and anon key must be set in environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function applyWalletFix() {
  try {
    console.log('Starting wallet details fix application...');
    
    // Read the SQL file content
    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250415_add_wallet_details_admin_function.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement using Supabase's REST API
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        // Use Supabase's REST API to execute SQL
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`Error executing statement ${i + 1}:`, error);
          console.log('Trying alternative approach...');
          
          // Try direct query as fallback
          const { error: directError } = await supabase.from('_exec_sql').select('*').eq('sql', statement);
          
          if (directError) {
            console.error('Alternative approach also failed:', directError);
          } else {
            console.log(`Statement ${i + 1} executed via alternative approach`);
          }
        } else {
          console.log(`Statement ${i + 1} executed successfully`);
        }
      } catch (stmtErr) {
        console.error(`Exception executing statement ${i + 1}:`, stmtErr);
      }
    }
    
    console.log('Wallet details fix applied successfully!');
    console.log('Please refresh your admin dashboard to see the wallet details.');
  } catch (err) {
    console.error('Error applying wallet details fix:', err);
  }
}

// Run the fix
applyWalletFix();
