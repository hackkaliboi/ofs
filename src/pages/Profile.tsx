import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Phone, Globe, Shield, Camera,
  Key, Bell, Lock, Wallet, Clock, History
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Profile as ProfileType } from "@/types/auth";

interface UserActivity {
  id: string;
  action_type: string;
  details: Record<string, unknown>;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileType>>({
    full_name: "",
    phone: "",
    country: "",
    timezone: "",
    avatar_url: ""
  });
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState({
    total_validations: 0,
    approved_validations: 0,
    pending_validations: 0
  });

  const loadProfileData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get user activities
      const { data: activities, error: activitiesError } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activitiesError) throw activitiesError;
      setActivities(activities || []);

      // Get validation stats
      const { data: stats, error: statsError } = await supabase
        .from('validation_statistics')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') throw statsError;
      if (stats) {
        setStats({
          total_validations: stats.total_validations,
          approved_validations: stats.approved_validations,
          pending_validations: stats.pending_validations
        });
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    loadProfileData();
  }, [user, navigate, loadProfileData]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        country: profile.country || "",
        timezone: profile.timezone || "",
        avatar_url: profile.avatar_url || ""
      });
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {

    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;

      await refreshProfile();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/${Math.random()}.${fileExt}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      await refreshProfile();
      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-20 bg-background">
        <div className="container-custom">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
                <p className="text-gray-600">Manage your account settings and preferences</p>
              </div>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-custodia hover:bg-custodia/90"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatedSection delay={1}>
                <div className="bg-card rounded-xl shadow-sm border p-6">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="space-y-6">
                      {/* Avatar Upload */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {formData.avatar_url ? (
                            <img 
                              src={formData.avatar_url}
                              alt={formData.full_name}
                              className="w-20 h-20 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-custodia/10 flex items-center justify-center">
                              <User className="h-8 w-8 text-custodia" />
                            </div>
                          )}
                          {isEditing && (
                            <label 
                              htmlFor="avatar-upload"
                              className="absolute bottom-0 right-0 p-1 bg-background rounded-full border cursor-pointer hover:bg-muted/50"
                            >
                              <Camera className="h-4 w-4 text-gray-600" />
                              <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                              />
                            </label>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{profile?.full_name || 'Your Name'}</h3>
                          <p className="text-sm text-gray-500">{profile?.email}</p>
                        </div>
                      </div>

                      {/* Profile Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            id="full_name"
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                            disabled={!isEditing}
                            className="mt-1 block w-full rounded-md border px-3 py-2 focus:border-primary focus:ring-primary disabled:bg-muted/50"
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                            className="mt-1 block w-full rounded-md border px-3 py-2 focus:border-primary focus:ring-primary disabled:bg-muted/50"
                          />
                        </div>

                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                            Country
                          </label>
                          <input
                            id="country"
                            type="text"
                            value={formData.country}
                            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                            disabled={!isEditing}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-custodia focus:ring-custodia disabled:bg-gray-800"
                          />
                        </div>

                        <div>
                          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                            Timezone
                          </label>
                          <input
                            id="timezone"
                            type="text"
                            value={formData.timezone}
                            onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                            disabled={!isEditing}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-custodia focus:ring-custodia disabled:bg-gray-800"
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex justify-end gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              setFormData({
                                full_name: profile?.full_name || "",
                                phone: profile?.phone || "",
                                country: profile?.country || "",
                                timezone: profile?.timezone || "",
                                avatar_url: profile?.avatar_url || ""
                              });
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </AnimatedSection>

              {/* Activity History */}
              <AnimatedSection delay={2}>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="bg-card rounded-xl shadow-sm border divide-y">
                    {activities.map((activity) => (
                      <div key={activity.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-custodia/10 p-2 rounded-lg">
                            <History className="h-4 w-4 text-custodia" />
                          </div>
                          <div>
                            <p className="font-medium">{activity.action_type.replace(/_/g, ' ')}</p>
                            {activity.details && (
                              <p className="text-sm text-gray-600 mt-1">
                                {JSON.stringify(activity.details)}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(activity.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Stats */}
              <AnimatedSection delay={3}>
                <div className="bg-card rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold mb-4">Validation Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-custodia" />
                        <span className="text-sm">Total Validations</span>
                      </div>
                      <span className="font-semibold">{stats.total_validations}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Approved</span>
                      </div>
                      <span className="font-semibold">{stats.approved_validations}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="font-semibold">{stats.pending_validations}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Quick Actions */}
              <AnimatedSection delay={4}>
                <div className="bg-card rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate('/dashboard')}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Manage Wallets
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate('/security')}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Security Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate('/notifications')}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notification Preferences
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
