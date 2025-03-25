import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/layout/Footer";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

const AdminLogin = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { data: authData, error } = await signIn(data.email, data.password);
      
      if (error) throw error;

      const userId = authData?.session?.user?.id;
      if (!userId) {
        throw new Error("Authentication failed");
      }
      
      // Check if user is admin
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!profileData || profileData.role !== 'admin') {
        throw new Error("Unauthorized access");
      }

      toast({
        title: "Welcome back, Admin!",
        description: "Successfully signed in to your admin account.",
        variant: "default"
      });

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "Access Denied",
        description: "Please check your credentials or contact the system administrator.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-b from-indigo-50/50 to-white px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-gray-600 mt-2">Please sign in to access the admin dashboard</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;
