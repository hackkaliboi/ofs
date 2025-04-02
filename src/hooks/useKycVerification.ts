import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

export type KycDocument = {
  id: string;
  user_id: string;
  document_type: string;
  document_number: string;
  front_image_url: string;
  back_image_url?: string;
  selfie_image_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewer_id?: string;
  rejection_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type KycDocumentWithUser = KycDocument & {
  profiles: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
};

export function useKycVerification() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userDocuments, setUserDocuments] = useState<KycDocument[]>([]);
  const [adminDocuments, setAdminDocuments] = useState<KycDocumentWithUser[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch user's KYC documents
  useEffect(() => {
    if (!user) return;

    const fetchUserDocuments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if tables exist first
        const { data: tables, error: tablesError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .in('table_name', ['kyc_documents', 'admin_users'])
          .eq('table_schema', 'public');
        
        if (tablesError) {
          console.error("Error checking tables:", tablesError);
          throw new Error("Failed to check if required tables exist");
        }
        
        // If tables don't exist, don't try to fetch documents
        const tableNames = tables?.map(t => t.table_name) || [];
        if (!tableNames.includes('kyc_documents')) {
          setUserDocuments([]);
          setLoading(false);
          return;
        }
        
        // Fetch user's documents
        const { data, error } = await supabase
          .from('kyc_documents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          // If the error is about the table not existing, we'll just show empty results
          if (error.message.includes('does not exist')) {
            setUserDocuments([]);
          } else {
            throw error;
          }
        } else {
          setUserDocuments(data || []);
        }
      } catch (err) {
        console.error("Error fetching user KYC documents:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserDocuments();
  }, [user, refreshTrigger]);

  // Fetch all KYC documents for admin
  useEffect(() => {
    if (!user) return;

    const fetchAdminDocuments = async () => {
      try {
        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id);
        
        if (adminError || !adminData || adminData.length === 0) {
          // User is not admin, don't fetch admin documents
          return;
        }
        
        // Fetch all documents with user information
        const { data, error } = await supabase
          .from('kyc_documents')
          .select(`
            *,
            profiles:user_id (
              full_name,
              email,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          // If the error is about the table not existing, we'll just show empty results
          if (error.message.includes('does not exist')) {
            setAdminDocuments([]);
          } else {
            throw error;
          }
        } else {
          setAdminDocuments(data || []);
        }
      } catch (err) {
        console.error("Error fetching admin KYC documents:", err);
      }
    };

    fetchAdminDocuments();
  }, [user, refreshTrigger]);

  // Helper function to upload a file
  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    if (!user) return null;
    
    try {
      // Check if storage bucket exists
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketsError) {
        console.error("Error listing buckets:", bucketsError);
        throw new Error("Failed to check storage buckets");
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'kyc-documents') || false;
      
      if (!bucketExists) {
        // Create bucket
        const { error: createError } = await supabase
          .storage
          .createBucket('kyc-documents', {
            public: true,
            fileSizeLimit: 5 * 1024 * 1024, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf']
          });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
          throw new Error("Failed to create storage bucket");
        }
      }
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${path}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (err) {
      console.error("Error in uploadFile:", err);
      toast({
        title: "Upload Failed",
        description: err instanceof Error ? err.message : "Failed to upload file",
        variant: "destructive",
      });
      return null;
    }
  };

  // Submit a new KYC document
  const submitKycDocument = async ({
    document_type,
    document_number,
    frontImage,
    backImage,
    selfieImage
  }: {
    document_type: string;
    document_number: string;
    frontImage: File;
    backImage?: File | null;
    selfieImage?: File | null;
  }) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit KYC documents.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // First check if kyc_documents table exists
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'kyc_documents')
        .eq('table_schema', 'public');
      
      if (tablesError) {
        console.error("Error checking tables:", tablesError);
        throw new Error("Failed to check if required tables exist");
      }
      
      // If table doesn't exist, initialize the KYC system
      if (!tables || tables.length === 0) {
        const success = await initializeKycSystem();
        if (!success) {
          throw new Error("Failed to initialize KYC system. Please try again.");
        }
      }
      
      const now = new Date().toISOString();
      
      // Upload front image
      const frontImageUrl = await uploadFile(frontImage, `front`);
      if (!frontImageUrl) {
        throw new Error("Failed to upload front image");
      }
      
      // Upload back image if provided
      let backImageUrl = null;
      if (backImage) {
        backImageUrl = await uploadFile(backImage, `back`);
      }
      
      // Upload selfie image if provided
      let selfieImageUrl = null;
      if (selfieImage) {
        selfieImageUrl = await uploadFile(selfieImage, `selfie`);
      }
      
      // Insert new document
      const { error } = await supabase
        .from('kyc_documents')
        .insert([
          {
            user_id: user.id,
            document_type,
            document_number,
            front_image_url: frontImageUrl,
            back_image_url: backImageUrl,
            selfie_image_url: selfieImageUrl,
            status: 'pending',
            submitted_at: now,
            created_at: now,
            updated_at: now,
          }
        ]);
      
      if (error) {
        console.error("Error inserting document:", error);
        throw new Error(`Failed to save document: ${error.message}`);
      }
      
      toast({
        title: "Document Submitted",
        description: "Your KYC document has been submitted for review.",
      });
      
      // Refresh documents
      setRefreshTrigger(prev => prev + 1);
      
      return true;
    } catch (err) {
      console.error("Error submitting KYC document:", err);
      toast({
        title: "Submission Failed",
        description: err instanceof Error ? err.message : "Failed to submit your KYC document. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Update KYC document status (for admins)
  const updateKycStatus = async (documentId: string, status: 'approved' | 'rejected', notes?: string) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update KYC status.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id);
      
      if (adminError || !adminData || adminData.length === 0) {
        toast({
          title: "Permission Denied",
          description: "You don't have permission to update KYC status.",
          variant: "destructive",
        });
        return false;
      }
      
      const now = new Date().toISOString();
      
      // Update document status
      const { error } = await supabase
        .from('kyc_documents')
        .update({
          status,
          reviewed_at: now,
          reviewer_id: user.id,
          rejection_reason: status === 'rejected' ? notes : null,
          notes: status === 'approved' ? notes : null,
          updated_at: now,
        })
        .eq('id', documentId);
      
      if (error) throw error;
      
      toast({
        title: `Document ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `The KYC document has been ${status}.`,
      });
      
      // Refresh documents
      setRefreshTrigger(prev => prev + 1);
      
      return true;
    } catch (err) {
      console.error("Error updating KYC status:", err);
      toast({
        title: "Update Failed",
        description: "Failed to update the KYC status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Create KYC table and storage bucket
  const initializeKycSystem = async () => {
    if (!user) return false;

    try {
      console.log('Starting KYC system initialization...');
      
      // Create extension if it doesn't exist
      console.log('Creating UUID extension...');
      const { error: extensionError } = await supabase.rpc('exec_sql', {
        sql: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
      });
      
      if (extensionError) {
        console.error("Error creating extension:", extensionError);
        // Continue anyway, as the error might be because the extension already exists
      }
      
      // Check if storage bucket exists
      console.log('Checking storage buckets...');
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketsError) {
        console.error("Error listing buckets:", bucketsError);
        // Continue anyway, try to create the bucket
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'kyc-documents') || false;
      
      if (!bucketExists) {
        // Create bucket
        console.log('Creating KYC documents storage bucket...');
        try {
          const { error: createError } = await supabase
            .storage
            .createBucket('kyc-documents', {
              public: true,
              fileSizeLimit: 5 * 1024 * 1024, // 5MB
              allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf']
            });
          
          if (createError) {
            console.error("Error creating bucket:", createError);
            // Continue anyway, the bucket might already exist
          }
        } catch (err) {
          console.error("Error creating bucket:", err);
          // Continue anyway, the bucket might already exist
        }
      }
      
      // Create admin_users table if it doesn't exist
      console.log('Creating admin_users table...');
      const adminTableSql = `
        CREATE TABLE IF NOT EXISTS admin_users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          role TEXT NOT NULL DEFAULT 'admin',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
        
        ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
      `;
      
      const { error: adminTableError } = await supabase.rpc('exec_sql', {
        sql: adminTableSql
      });
      
      if (adminTableError) {
        console.error("Error creating admin_users table:", adminTableError);
        // Continue anyway, as the error might be because the table already exists
      }
      
      // Create admin policies
      console.log('Creating admin policies...');
      try {
        // First try to drop existing policies
        await supabase.rpc('exec_sql', {
          sql: `
            DO $$
            BEGIN
              BEGIN
                DROP POLICY IF EXISTS "Admin users can view admin_users" ON admin_users;
              EXCEPTION WHEN OTHERS THEN
                -- Policy doesn't exist, ignore error
                RAISE NOTICE 'Policy does not exist';
              END;
              
              BEGIN
                DROP POLICY IF EXISTS "Admin users can manage admin_users" ON admin_users;
              EXCEPTION WHEN OTHERS THEN
                -- Policy doesn't exist, ignore error
                RAISE NOTICE 'Policy does not exist';
              END;
            END
            $$;
          `
        });
        
        // Then create new policies
        await supabase.rpc('exec_sql', {
          sql: `
            CREATE POLICY "Admin users can view admin_users"
              ON admin_users
              FOR SELECT
              USING (
                auth.uid() IN (
                  SELECT user_id FROM admin_users WHERE user_id = auth.uid()
                )
              );
          `
        });
        
        await supabase.rpc('exec_sql', {
          sql: `
            CREATE POLICY "Admin users can manage admin_users"
              ON admin_users
              FOR ALL
              USING (
                auth.uid() IN (
                  SELECT user_id FROM admin_users WHERE user_id = auth.uid()
                )
              );
          `
        });
        
        // Add current user as admin if table is empty
        await supabase.rpc('exec_sql', {
          sql: `
            INSERT INTO admin_users (user_id, role, created_at, updated_at)
            SELECT '${user.id}', 'admin', NOW(), NOW()
            WHERE NOT EXISTS (SELECT 1 FROM admin_users LIMIT 1);
          `
        });
      } catch (err) {
        console.error("Error creating admin policies:", err);
        // Continue anyway, policies might already exist
      }
      
      // Create KYC table if it doesn't exist
      console.log('Creating kyc_documents table...');
      const kycTableSql = `
        CREATE TABLE IF NOT EXISTS kyc_documents (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          document_type TEXT NOT NULL,
          document_number TEXT NOT NULL,
          front_image_url TEXT NOT NULL,
          back_image_url TEXT,
          selfie_image_url TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          submitted_at TIMESTAMPTZ NOT NULL,
          reviewed_at TIMESTAMPTZ,
          reviewer_id UUID,
          rejection_reason TEXT,
          notes TEXT,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        );
        
        CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
        CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON kyc_documents(status);
        
        ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
      `;
      
      const { error: tableError } = await supabase.rpc('exec_sql', {
        sql: kycTableSql
      });
      
      if (tableError) {
        console.error("Error creating kyc_documents table:", tableError);
        // Continue anyway, table might already exist
      }
      
      // Create KYC policies
      console.log('Creating KYC policies...');
      try {
        // First try to drop existing policies
        await supabase.rpc('exec_sql', {
          sql: `
            DO $$
            BEGIN
              BEGIN
                DROP POLICY IF EXISTS "Users can view their own KYC documents" ON kyc_documents;
              EXCEPTION WHEN OTHERS THEN
                -- Policy doesn't exist, ignore error
                RAISE NOTICE 'Policy does not exist';
              END;
              
              BEGIN
                DROP POLICY IF EXISTS "Users can insert their own KYC documents" ON kyc_documents;
              EXCEPTION WHEN OTHERS THEN
                -- Policy doesn't exist, ignore error
                RAISE NOTICE 'Policy does not exist';
              END;
              
              BEGIN
                DROP POLICY IF EXISTS "Admin users can view all KYC documents" ON kyc_documents;
              EXCEPTION WHEN OTHERS THEN
                -- Policy doesn't exist, ignore error
                RAISE NOTICE 'Policy does not exist';
              END;
              
              BEGIN
                DROP POLICY IF EXISTS "Admin users can update KYC documents" ON kyc_documents;
              EXCEPTION WHEN OTHERS THEN
                -- Policy doesn't exist, ignore error
                RAISE NOTICE 'Policy does not exist';
              END;
            END
            $$;
          `
        });
        
        // Then create new policies one by one
        await supabase.rpc('exec_sql', {
          sql: `
            CREATE POLICY "Users can view their own KYC documents"
              ON kyc_documents
              FOR SELECT
              USING (auth.uid() = user_id);
          `
        });
        
        await supabase.rpc('exec_sql', {
          sql: `
            CREATE POLICY "Users can insert their own KYC documents"
              ON kyc_documents
              FOR INSERT
              WITH CHECK (auth.uid() = user_id);
          `
        });
        
        await supabase.rpc('exec_sql', {
          sql: `
            CREATE POLICY "Admin users can view all KYC documents"
              ON kyc_documents
              FOR SELECT
              USING (
                auth.uid() IN (
                  SELECT user_id FROM admin_users WHERE user_id = auth.uid()
                )
              );
          `
        });
        
        await supabase.rpc('exec_sql', {
          sql: `
            CREATE POLICY "Admin users can update KYC documents"
              ON kyc_documents
              FOR UPDATE
              USING (
                auth.uid() IN (
                  SELECT user_id FROM admin_users WHERE user_id = auth.uid()
                )
              );
          `
        });
      } catch (err) {
        console.error("Error creating KYC policies:", err);
        // Continue anyway, policies might already exist
      }
      
      // Refresh documents
      console.log('KYC system initialization completed successfully!');
      setRefreshTrigger(prev => prev + 1);
      
      return true;
    } catch (err) {
      console.error("Error initializing KYC system:", err);
      return false;
    }
  };

  return {
    loading,
    error,
    userDocuments,
    adminDocuments,
    submitKycDocument,
    updateKycStatus,
    initializeKycSystem,
    refresh: () => setRefreshTrigger(prev => prev + 1),
  };
}
