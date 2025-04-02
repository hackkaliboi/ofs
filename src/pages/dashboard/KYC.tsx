import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const KYC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load form immediately
  useEffect(() => {
    // Simulate quick loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle file selection with preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFrontImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit documents.",
        variant: "destructive",
      });
      return;
    }
    
    if (!documentType || !documentNumber || !frontImage || !imagePreview) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload front image.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isSubmitting) {
        setIsSubmitting(false);
        toast({
          title: "Submission Timeout",
          description: "The submission is taking too long. Please try again.",
          variant: "destructive",
        });
      }
    }, 15000);
    
    try {
      // Store the document info with base64 image directly
      const kycDocument = {
        id: `kyc-${user.id}-${Date.now()}`,
        user_id: user.id,
        document_type: documentType,
        document_number: documentNumber,
        image_data: imagePreview,
        status: 'pending',
        submitted_at: new Date().toISOString()
      };
      
      // Save to local storage
      const existingDocs = JSON.parse(localStorage.getItem('kyc_documents') || '[]');
      existingDocs.push(kycDocument);
      localStorage.setItem('kyc_documents', JSON.stringify(existingDocs));
      
      // Also save to IndexedDB for larger storage if available
      try {
        if ('indexedDB' in window) {
          const request = indexedDB.open('ofsledger', 1);
          
          request.onupgradeneeded = (event) => {
            const db = request.result;
            if (!db.objectStoreNames.contains('kyc_documents')) {
              db.createObjectStore('kyc_documents', { keyPath: 'id' });
            }
          };
          
          request.onsuccess = (event) => {
            const db = request.result;
            const transaction = db.transaction(['kyc_documents'], 'readwrite');
            const store = transaction.objectStore('kyc_documents');
            store.add(kycDocument);
          };
        }
      } catch (dbError) {
        console.error("IndexedDB error:", dbError);
        // Continue anyway, we have localStorage as backup
      }
      
      // Clear the timeout since we're done
      clearTimeout(timeoutId);
      
      toast({
        title: "Document Submitted",
        description: "Your KYC document has been saved locally. An admin will review it soon.",
      });
      
      // Reset form
      setDocumentType("");
      setDocumentNumber("");
      setFrontImage(null);
      setImagePreview(null);
      setIsSubmitting(false);
    } catch (err) {
      clearTimeout(timeoutId);
      
      console.error("Error submitting document:", err);
      toast({
        title: "Submission Failed",
        description: err instanceof Error ? err.message : "Failed to submit document",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold">KYC Verification</h1>

      {isLoading ? (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading form...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Submit KYC Document</CardTitle>
            <CardDescription>
              Please provide your identity document information for verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="documentType">Document Type *</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Passport">Passport</SelectItem>
                      <SelectItem value="Driver's License">Driver's License</SelectItem>
                      <SelectItem value="National ID">National ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="documentNumber">Document Number *</Label>
                  <Input
                    id="documentNumber"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="Enter document number"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="frontImage">Document Image *</Label>
                  <Input
                    id="frontImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-1">
                        Selected: {frontImage?.name}
                      </p>
                      <div className="border rounded-md p-2 max-w-[300px]">
                        <img 
                          src={imagePreview} 
                          alt="Document preview" 
                          className="max-w-full h-auto rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                className="w-full mt-6" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Document"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KYC;
