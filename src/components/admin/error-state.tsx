import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function AdminErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      
      <Button 
        onClick={onRetry}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
      >
        <RefreshCcw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
