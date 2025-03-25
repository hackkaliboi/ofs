import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { error, data: authData } = await signIn(data.email, data.password);
      
      if (error) throw error;

      const userId = authData?.session?.user?.id;
      if (!userId) {
        throw new Error("Authentication failed");
      }
      
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      // Redirect to appropriate dashboard
      const from = location.state?.from?.pathname || 
        (profile?.role === 'admin' ? "/admin/users" : "/dashboard");
      
      toast.success("Welcome back!");
      navigate(from);
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#151C31] rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-600/10 rounded-full flex items-center justify-center">
            <LogIn className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="bg-[#1A2238] border-[#1F2B45] text-white"
                      {...field}
                    />
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
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-[#1A2238] border-[#1F2B45] text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
