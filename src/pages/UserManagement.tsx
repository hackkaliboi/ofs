import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Search, Edit, Trash2, UserPlus, LogIn, 
  Shield, Clock, Mail, Phone, Globe, Key 
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Profile } from "@/types/auth";

const UserManagement = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!user || profile?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    loadUsers();
  }, [user]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          role,
          phone,
          country,
          timezone,
          avatar_url,
          status,
          two_factor_enabled,
          last_login,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(profiles);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (userData: Partial<Profile>) => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', editingUser.id);

      if (error) throw error;

      toast.success('User updated successfully');
      loadUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleLoginAsUser = async (userId: string) => {
    try {
      // Start user session
      const { data, error } = await supabase.rpc('start_user_session', {
        p_admin_id: user?.id,
        p_user_id: userId,
        p_ip_address: null,
        p_user_agent: navigator.userAgent
      });

      if (error) throw error;

      // Get auth session for user
      const { data: { user: targetUser }, error: authError } = await supabase.auth.admin.getUserById(userId);
      if (authError) throw authError;

      // Store original admin session
      localStorage.setItem('admin_session', JSON.stringify({
        user_id: user?.id,
        session_id: data
      }));

      // Switch to user session
      await supabase.auth.signInWithPassword({ 
        email: targetUser.email,
        password: '' // We'll need to implement a proper way to handle this
      });
      
      toast.success('Logged in as user');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in as user:', error);
      toast.error('Failed to login as user');
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.full_name.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      user.country?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-20">
        <div className="container-custom">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">User Management</h1>
                <p className="text-gray-600">Manage users and their permissions</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custodia/50"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-custodia hover:bg-custodia/90"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={1}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Security</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          Loading users...
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {user.avatar_url ? (
                                <img 
                                  src={user.avatar_url} 
                                  alt={user.full_name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-custodia/10 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-custodia" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{user.full_name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 ${
                              user.role === 'admin' ? 'text-custodia' : 'text-gray-600'
                            }`}>
                              <Shield className="h-4 w-4" />
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Mail className="h-4 w-4" />
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <Phone className="h-4 w-4" />
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {user.country && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Globe className="h-4 w-4" />
                                {user.country}
                                {user.timezone && ` (${user.timezone})`}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' 
                                ? 'bg-green-50 text-green-600'
                                : 'bg-gray-50 text-gray-600'
                            }`}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Key className="h-4 w-4" />
                                2FA: {user.two_factor_enabled ? 'Enabled' : 'Disabled'}
                              </div>
                              {user.last_login && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <Clock className="h-4 w-4" />
                                  Last login: {new Date(user.last_login).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                onClick={() => handleLoginAsUser(user.id)}
                              >
                                <LogIn className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-custodia border-custodia hover:bg-custodia/10"
                                onClick={() => setEditingUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserManagement;
