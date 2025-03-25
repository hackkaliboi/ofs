import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { Shield } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
});

type FormData = z.infer<typeof formSchema>;

const FirstAdmin = () => {
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Check if any admin users already exist
      const { data: existingAdmins, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (checkError) throw checkError;

      if (existingAdmins && existingAdmins.length > 0) {
        toast.error("An admin user already exists. Please use the regular admin login.");
        navigate("/admin/login");
        return;
      }

      // First, create the auth user
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) throw signUpError;

      // Create admin profile using admin client
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: newUser.user?.id,
          full_name: data.fullName,
          email: data.email,
          role: 'admin',
        })
        .select()
        .single();

      if (profileError) {
        // If profile creation fails, try to delete the auth user
        await supabaseAdmin.auth.admin.deleteUser(newUser.user?.id || '');
        throw profileError;
      }

      toast.success("Admin account created successfully! Please sign in.");
      navigate("/admin/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to create admin user");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create First Admin</h2>
          <p className="mt-2 text-sm text-gray-600">
            Set up the first administrator account for your platform
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
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
                {form.formState.isSubmitting ? "Creating..." : "Create Admin Account"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default FirstAdmin;
