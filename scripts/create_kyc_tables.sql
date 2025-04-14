-- KYC Documents Table Creation Script
-- Run this in your Supabase SQL Editor

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create KYC Documents Table
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  front_image_url TEXT NOT NULL,
  back_image_url TEXT,
  selfie_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_id UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON kyc_documents(status);

-- Enable Row Level Security
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON kyc_documents;
DROP POLICY IF EXISTS "Users can insert their own KYC documents" ON kyc_documents;
DROP POLICY IF EXISTS "Admin users can view all KYC documents" ON kyc_documents;
DROP POLICY IF EXISTS "Admin users can update KYC documents" ON kyc_documents;

-- Create RLS policies
-- 1. Users can view their own documents
CREATE POLICY "Users can view their own KYC documents"
  ON kyc_documents
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Users can insert their own documents
CREATE POLICY "Users can insert their own KYC documents"
  ON kyc_documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Admin users can view all documents
CREATE POLICY "Admin users can view all KYC documents"
  ON kyc_documents
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- 4. Admin users can update documents (for approval/rejection)
CREATE POLICY "Admin users can update KYC documents"
  ON kyc_documents
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- Create a view to join KYC documents with user profiles for admin dashboard
CREATE OR REPLACE VIEW kyc_documents_with_users AS
SELECT 
  kd.*,
  p.full_name,
  p.email,
  p.avatar_url
FROM 
  kyc_documents kd
LEFT JOIN 
  profiles p ON kd.user_id = p.id;

-- Insert a test document (optional, comment out if not needed)
/*
INSERT INTO kyc_documents (
  user_id,
  document_type,
  document_number,
  front_image_url,
  status
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with a real user ID
  'Passport',
  'TEST123456',
  'https://example.com/test-image.jpg',
  'pending'
);
*/
