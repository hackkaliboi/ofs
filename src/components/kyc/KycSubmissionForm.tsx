import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Upload, AlertCircle, Info, FileText, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

// Form schema for validation
const formSchema = z.object({
  document_type: z.string({
    required_error: "Please select a document type",
  }),
  document_number: z.string().min(3, {
    message: "Document number must be at least 3 characters",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface KycSubmissionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function KycSubmissionForm({ onSuccess, onCancel }: KycSubmissionFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [frontImageError, setFrontImageError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document_type: "",
      document_number: "",
    },
  });

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>, setError?: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      if (setError) setError("File size must be less than 5MB");
      toast({
        title: "File Too Large",
        description: "The selected file exceeds the 5MB size limit.",
        variant: "destructive",
      });
      return;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      if (setError) setError("File must be JPEG, PNG, or PDF");
      toast({
        title: "Invalid File Type",
        description: "Please select a JPEG, PNG, or PDF file.",
        variant: "destructive",
      });
      return;
    }
    
    setFile(file);
    if (setError) setError(null);
    
    toast({
      title: "File Selected",
      description: `${file.name} has been selected.`,
    });
  };

  // Clear a selected file
  const clearFile = (setFile: React.Dispatch<React.SetStateAction<File | null>>, setError?: React.Dispatch<React.SetStateAction<string | null>>) => {
    setFile(null);
    if (setError) setError(null);
  };

  // Handle file upload to Supabase Storage
  const uploadFile = async (file: File, path: string): Promise<string> => {
    if (!user) throw new Error("User not authenticated");
    if (!file) throw new Error("No file provided");
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;
      
      // Make sure the bucket exists before uploading
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error("Error listing buckets:", bucketsError);
        throw new Error("Could not access storage buckets");
      }
      
      const bucketExists = buckets.some(bucket => bucket.name === 'kyc-documents');
      
      if (!bucketExists) {
        // Try to create the bucket
        const { error: createError } = await supabase.storage.createBucket('kyc-documents', {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf']
        });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
          throw new Error("Could not create storage bucket");
        }
      }
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      // Update progress manually after upload completes
      setUploadProgress(100);
      
      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (err) {
      console.error("Error in uploadFile:", err);
      throw err;
    } finally {
      // Reset progress after upload completes or fails
      setUploadProgress(0);
    }
  };

  // Check if admin_users table exists and create it if needed
  const ensureAdminUsersTable = async () => {
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'admin_users')
        .eq('table_schema', 'public');
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Create admin_users table
        const { error: sqlError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS admin_users (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
              role TEXT NOT NULL DEFAULT 'admin',
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            
            CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
            
            ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
            
            DO $$
            BEGIN
              BEGIN
                DROP POLICY IF EXISTS "Admin users can view admin_users" ON admin_users;
              EXCEPTION WHEN OTHERS THEN
                -- Policy doesn't exist, ignore error
              END;
              
              BEGIN
                DROP POLICY IF EXISTS "Admin users can manage admin_users" ON admin_users;
              EXCEPTION WHEN OTHERS THEN
                -- Policy doesn't exist, ignore error
              END;
            END
            $$;
            
            CREATE POLICY "Admin users can view admin_users"
              ON admin_users
              FOR SELECT
              USING (
                auth.uid() IN (
                  SELECT user_id FROM admin_users WHERE user_id = auth.uid()
                )
              );
            
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
        
        if (sqlError) throw sqlError;
      }
      
      return true;
    } catch (err) {
      console.error("Error ensuring admin_users table:", err);
      return false;
    }
  };

  // Check if kyc_documents table exists and create it if needed
  const ensureKycDocumentsTable = async () => {
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'kyc_documents')
        .eq('table_schema', 'public');
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Create kyc_documents table
        const { error: sqlError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS kyc_documents (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
              document_type TEXT NOT NULL,
              document_number TEXT NOT NULL,
              front_image_url TEXT NOT NULL,
              back_image_url TEXT,
              selfie_image_url TEXT,
              status TEXT NOT NULL DEFAULT 'pending',
              submitted_at TIMESTAMPTZ NOT NULL,
              reviewed_at TIMESTAMPTZ,
              reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
              rejection_reason TEXT,
              notes TEXT,
              created_at TIMESTAMPTZ NOT NULL,
              updated_at TIMESTAMPTZ NOT NULL
            );
            
            CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
            CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON kyc_documents(status);
            
            ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
            
            DO $$
            BEGIN
              BEGIN
                DROP POLICY IF EXISTS "Users can view their own KYC documents" ON kyc_documents;
              EXCEPTION WHEN OTHERS THEN
                -- Policy doesn't exist, ignore error
              END;
              
              BEGIN
                DROP POLICY IF EXISTS "Users can insert their own KYC documents" ON kyc_documents;
              EXCEPTION WHEN OTHERS THEN
                -- Policy doesn't exist, ignore error
              END;
              
              BEGIN
                DROP POLICY IF EXISTS "Admin users can view all KYC documents" ON kyc_documents;
              EXCEPTION WHEN OTHERS THEN
                -- Policy doesn't exist, ignore error
              END;
              
              BEGIN
                DROP POLICY IF EXISTS "Admin users can update KYC documents" ON kyc_documents;
              EXCEPTION WHEN OTHERS THEN
                -- Policy doesn't exist, ignore error
              END;
            END
            $$;
            
            CREATE POLICY "Users can view their own KYC documents"
              ON kyc_documents
              FOR SELECT
              USING (auth.uid() = user_id);
            
            CREATE POLICY "Users can insert their own KYC documents"
              ON kyc_documents
              FOR INSERT
              WITH CHECK (auth.uid() = user_id);
            
            CREATE POLICY "Admin users can view all KYC documents"
              ON kyc_documents
              FOR SELECT
              USING (
                auth.uid() IN (
                  SELECT user_id FROM admin_users WHERE user_id = auth.uid()
                )
              );
            
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
        
        if (sqlError) throw sqlError;
      }
      
      return true;
    } catch (err) {
      console.error("Error ensuring kyc_documents table:", err);
      return false;
    }
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    // Validate front image
    if (!frontImage) {
      setFrontImageError("Front image is required");
      toast({
        title: "Missing Document",
        description: "Front image of your document is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit KYC documents.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Ensure required tables exist
      toast({
        title: "Preparing Submission",
        description: "Setting up verification system...",
      });
      
      const adminTableExists = await ensureAdminUsersTable();
      const kycTableExists = await ensureKycDocumentsTable();
      
      if (!adminTableExists || !kycTableExists) {
        throw new Error("Failed to initialize verification system. Please try again later.");
      }
      
      // Upload front image
      toast({
        title: "Uploading Documents",
        description: "Uploading front image...",
      });
      
      let frontImageUrl;
      try {
        frontImageUrl = await uploadFile(frontImage, 'front');
      } catch (uploadError) {
        console.error("Error uploading front image:", uploadError);
        throw new Error("Failed to upload front image. Please try again.");
      }
      
      // Upload back image if provided
      let backImageUrl = undefined;
      if (backImage) {
        toast({
          title: "Uploading Documents",
          description: "Uploading back image...",
        });
        
        try {
          backImageUrl = await uploadFile(backImage, 'back');
        } catch (uploadError) {
          console.error("Error uploading back image:", uploadError);
          throw new Error("Failed to upload back image. Please try again.");
        }
      }
      
      // Upload selfie image if provided
      let selfieImageUrl = undefined;
      if (selfieImage) {
        toast({
          title: "Uploading Documents",
          description: "Uploading selfie image...",
        });
        
        try {
          selfieImageUrl = await uploadFile(selfieImage, 'selfie');
        } catch (uploadError) {
          console.error("Error uploading selfie image:", uploadError);
          throw new Error("Failed to upload selfie image. Please try again.");
        }
      }
      
      // Create KYC document record
      toast({
        title: "Finalizing Submission",
        description: "Saving your document information...",
      });
      
      const now = new Date().toISOString();
      const { error: insertError } = await supabase
        .from('kyc_documents')
        .insert([
          {
            user_id: user.id,
            document_type: values.document_type,
            document_number: values.document_number,
            front_image_url: frontImageUrl,
            back_image_url: backImageUrl,
            selfie_image_url: selfieImageUrl,
            status: 'pending',
            submitted_at: now,
            created_at: now,
            updated_at: now,
          }
        ]);
      
      if (insertError) {
        console.error("Error inserting KYC document:", insertError);
        throw insertError;
      }
      
      toast({
        title: "Document Submitted",
        description: "Your KYC document has been submitted for review.",
      });
      
      onSuccess();
    } catch (err) {
      console.error("Error submitting KYC document:", err);
      setError(err instanceof Error ? err.message : "Failed to submit document. Please try again.");
      
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render file preview
  const renderFilePreview = (file: File | null) => {
    if (!file) return null;
    
    return (
      <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-md">
        <FileText className="h-4 w-4" />
        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit KYC Document</CardTitle>
        <CardDescription>
          Provide your identity document details for verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Document Requirements</AlertTitle>
          <AlertDescription>
            Please ensure your documents are clear, unobstructed, and all information is legible. 
            Supported formats: JPG, PNG, PDF. Maximum file size: 5MB.
          </AlertDescription>
        </Alert>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="document_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="drivers_license">Driver's License</SelectItem>
                      <SelectItem value="national_id">National ID Card</SelectItem>
                      <SelectItem value="residence_permit">Residence Permit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of identity document you are submitting
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="document_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the identification number on your document
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator />
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="front_image">Front Image <span className="text-yellow-500">*</span></Label>
                <div className="mt-1">
                  {frontImage ? (
                    <div className="flex items-center justify-between">
                      {renderFilePreview(frontImage)}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => clearFile(setFrontImage, setFrontImageError)}
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Input
                      id="front_image"
                      type="file"
                      accept="image/png, image/jpeg, application/pdf"
                      onChange={(e) => handleFileChange(e, setFrontImage, setFrontImageError)}
                      className="mt-1"
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload the front side of your document
                </p>
                {frontImageError && (
                  <p className="text-sm text-yellow-500 mt-1">{frontImageError}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="back_image">Back Image (Optional)</Label>
                <div className="mt-1">
                  {backImage ? (
                    <div className="flex items-center justify-between">
                      {renderFilePreview(backImage)}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => clearFile(setBackImage)}
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Input
                      id="back_image"
                      type="file"
                      accept="image/png, image/jpeg, application/pdf"
                      onChange={(e) => handleFileChange(e, setBackImage)}
                      className="mt-1"
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload the back side of your document (if applicable)
                </p>
              </div>
              
              <div>
                <Label htmlFor="selfie_image">Selfie with Document (Optional)</Label>
                <div className="mt-1">
                  {selfieImage ? (
                    <div className="flex items-center justify-between">
                      {renderFilePreview(selfieImage)}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => clearFile(setSelfieImage)}
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Input
                      id="selfie_image"
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={(e) => handleFileChange(e, setSelfieImage)}
                      className="mt-1"
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload a photo of yourself holding your document
                </p>
              </div>
            </div>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-secondary rounded-full h-2.5 mt-4">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Submit Document
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
