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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  role: z.enum(["admin", "user"]),
});

type FormData = z.infer<typeof formSchema>;

const CreateUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      role: "user",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Check if current user is admin
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (adminProfile?.role !== 'admin') {
        toast.error("Access denied. Admin privileges required.");
        navigate("/admin/login");
        return;
      }

      // Create new user
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) throw signUpError;

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.user?.id,
          full_name: data.fullName,
          email: data.email,
          role: data.role,
        });

      if (profileError) throw profileError;

      // Log the user creation
      await supabase
        .from('user_activity_log')
        .insert({
          user_id: user?.id,
          action_type: 'USER_CREATED',
          details: {
            created_user_id: newUser.user?.id,
            created_user_email: data.email,
            created_user_role: data.role,
            created_at: new Date().toISOString(),
          },
        });

      toast.success("User created successfully!");
      navigate("/admin/users");
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/users")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <h1 className="text-3xl font-bold">Create New User</h1>
        <p className="text-muted-foreground mt-2">
          Create a new user account with specific role and permissions.
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6 shadow-sm">
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
                      placeholder="user@example.com"
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

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateUser;
