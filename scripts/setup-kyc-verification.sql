-- Create KYC verification table
CREATE TABLE IF NOT EXISTS public.kyc_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    document_type TEXT NOT NULL,
    document_number TEXT,
    front_image_url TEXT,
    back_image_url TEXT,
    selfie_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_notes TEXT,
    rejected_reason TEXT
);

-- Add RLS policies
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own KYC verifications
CREATE POLICY "Users can view their own KYC verifications"
ON public.kyc_verifications
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for users to insert their own KYC verifications
CREATE POLICY "Users can create their own KYC verifications"
ON public.kyc_verifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for service role to view all KYC verifications
CREATE POLICY "Service role can view all KYC verifications"
ON public.kyc_verifications
FOR SELECT
USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- Create policy for service role to update all KYC verifications
CREATE POLICY "Service role can update all KYC verifications"
ON public.kyc_verifications
FOR UPDATE
USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS kyc_verifications_user_id_idx ON public.kyc_verifications(user_id);
CREATE INDEX IF NOT EXISTS kyc_verifications_status_idx ON public.kyc_verifications(status);
CREATE INDEX IF NOT EXISTS kyc_verifications_submitted_at_idx ON public.kyc_verifications(submitted_at);

-- Add function to update profiles when KYC is approved
CREATE OR REPLACE FUNCTION public.handle_kyc_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        -- Update the user's profile to mark KYC as verified
        UPDATE public.profiles
        SET kyc_verified = true,
            kyc_verified_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update profile when KYC is approved
DROP TRIGGER IF EXISTS update_profile_on_kyc_approval ON public.kyc_verifications;
CREATE TRIGGER update_profile_on_kyc_approval
AFTER UPDATE ON public.kyc_verifications
FOR EACH ROW
WHEN (NEW.status = 'approved' AND OLD.status != 'approved')
EXECUTE FUNCTION public.handle_kyc_approval();

-- Ensure profiles table has the necessary columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS kyc_verified_at TIMESTAMP WITH TIME ZONE;
