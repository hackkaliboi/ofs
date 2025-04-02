// Script to create the KYC documents storage bucket
// Run this with: node create-kyc-bucket.js

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Try to read .env file directly if dotenv doesn't work
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Simple parsing of .env file
    const envVars = envContent.split('\n').reduce((acc, line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        acc[match[1].trim()] = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
      }
      return acc;
    }, {});
    
    supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
    supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Loaded Supabase credentials from .env file');
  } catch (err) {
    console.error('Error reading .env file:', err);
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing Supabase credentials. Please check your .env file.');
  console.error('Required variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createKycBucket() {
  console.log('Creating KYC documents bucket...');
  
  try {
    // First check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'kyc-documents') || false;
    
    if (!bucketExists) {
      // Create bucket with public access
      const { error: bucketError } = await supabase.storage.createBucket('kyc-documents', {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf']
      });
      
      if (bucketError) {
        console.error('Error creating bucket:', bucketError);
      } else {
        console.log('Storage bucket created successfully');
      }
    } else {
      console.log('Storage bucket already exists');
    }
  } catch (err) {
    console.error('Bucket operation error:', err);
  }
}

createKycBucket()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
