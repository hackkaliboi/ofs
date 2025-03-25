import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle, XCircle, AlertCircle, Search, BarChart, History, Users } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ValidationStatistics {
  total_validations: number;
  approved_validations: number;
  rejected_validations: number;
  pending_validations: number;
  approval_rate: number;
}

interface ValidationHistory {
  id: string;
  status: string;
  notes: string;
  admin_id: string;
  created_at: string;
}

interface Validation {
  id: string;
  user_id: string;
  wallet_name: string;
  wallet_type: string;
  wallet_address: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  history?: ValidationHistory[];
}

interface UserProfile {
  full_name: string;
  email: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [validations, setValidations] = useState<Validation[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  const [statistics, setStatistics] = useState<ValidationStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValidation, setSelectedValidation] = useState<string | null>(null);

  useEffect(() => {
    if (!user || profile?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Get validation overview
      const { data: overviewData } = await supabase
        .from('validation_overview')
        .select('*')
        .single();

      if (overviewData) {
        setStatistics({
          total_validations: overviewData.total_validations || 0,
          approved_validations: overviewData.approved_validations || 0,
          rejected_validations: overviewData.rejected_validations || 0,
          pending_validations: overviewData.pending_validations || 0,
          approval_rate: overviewData.approval_rate || 0
        });
      }

      // Get all validations with history
      const { data: validationData, error: validationError } = await supabase
        .from('wallet_validations')
        .select(`
          *,
          history:validation_history(*)
        `)
        .order('created_at', { ascending: false });

      if (validationError) throw validationError;

      setValidations(validationData || []);

      // Get user profiles
      const userIds = [...new Set(validationData?.map(v => v.user_id) || [])];
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      if (profileError) throw profileError;

      const profileMap: Record<string, UserProfile> = {};
      profileData?.forEach(p => {
        profileMap[p.id] = { full_name: p.full_name, email: p.email };
      });

      setUserProfiles(profileMap);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidationAction = async (validationId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('wallet_validations')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', validationId);

      if (error) throw error;

      // Add notes if provided
      if (notes) {
        await supabase
          .from('validation_history')
          .insert({
            validation_id: validationId,
            status,
            notes,
            admin_id: user?.id
          });
      }

      toast.success(`Validation ${status} successfully`);
      loadDashboardData();
      setSelectedValidation(null);
    } catch (error) {
      console.error('Error updating validation:', error);
      toast.error('Failed to update validation');
    }
  };

  const filteredValidations = validations.filter(validation => {
    const searchLower = searchTerm.toLowerCase();
    const userProfile = userProfiles[validation.user_id];
    
    return (
      validation.wallet_address.toLowerCase().includes(searchLower) ||
      validation.wallet_name.toLowerCase().includes(searchLower) ||
      validation.wallet_type.toLowerCase().includes(searchLower) ||
      userProfile?.full_name.toLowerCase().includes(searchLower) ||
      userProfile?.email.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-20">
        <div className="container-custom">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Manage wallet validations and user requests</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search validations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custodia/50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </AnimatedSection>

          {statistics && (
            <AnimatedSection delay={1}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Validations</p>
                      <p className="text-2xl font-bold">{statistics.total_validations}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Approved</p>
                      <p className="text-2xl font-bold">{statistics.approved_validations}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rejected</p>
                      <p className="text-2xl font-bold">{statistics.rejected_validations}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold">{statistics.pending_validations}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection delay={2}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Wallet Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Address</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          Loading validations...
                        </td>
                      </tr>
                    ) : filteredValidations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          No validations found
                        </td>
                      </tr>
                    ) : (
                      filteredValidations.map((validation) => {
                        const userProfile = userProfiles[validation.user_id];
                        const isSelected = selectedValidation === validation.id;
                        
                        return (
                          <React.Fragment key={validation.id}>
                            <tr 
                              className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-gray-50' : ''}`}
                              onClick={() => setSelectedValidation(isSelected ? null : validation.id)}
                            >
                              <td className="px-6 py-4">
                                <div>
                                  <div className="font-medium">{userProfile?.full_name || 'Unknown'}</div>
                                  <div className="text-sm text-gray-500">{userProfile?.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">{validation.wallet_name}</td>
                              <td className="px-6 py-4">{validation.wallet_type}</td>
                              <td className="px-6 py-4">
                                <div className="font-mono text-sm">{validation.wallet_address}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 ${getStatusColor(validation.status)}`}>
                                  {validation.status === 'approved' && <CheckCircle className="h-4 w-4" />}
                                  {validation.status === 'rejected' && <XCircle className="h-4 w-4" />}
                                  {validation.status === 'pending' && <AlertCircle className="h-4 w-4" />}
                                  {validation.status.charAt(0).toUpperCase() + validation.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(validation.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                {validation.status === 'pending' && (
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-600 border-green-600 hover:bg-green-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleValidationAction(validation.id, 'approved');
                                      }}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-600 hover:bg-red-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleValidationAction(validation.id, 'rejected');
                                      }}
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                            {isSelected && validation.history && (
                              <tr>
                                <td colSpan={7} className="bg-gray-50 px-6 py-4">
                                  <div className="space-y-4">
                                    <h4 className="font-medium">Validation History</h4>
                                    <div className="space-y-2">
                                      {validation.history.map((historyItem) => (
                                        <div 
                                          key={historyItem.id}
                                          className="flex items-start gap-3 text-sm"
                                        >
                                          <div className={`${getStatusColor(historyItem.status)} shrink-0 mt-1`}>
                                            {historyItem.status === 'approved' && <CheckCircle className="h-4 w-4" />}
                                            {historyItem.status === 'rejected' && <XCircle className="h-4 w-4" />}
                                          </div>
                                          <div>
                                            <p className="font-medium">
                                              Status changed to {historyItem.status}
                                            </p>
                                            {historyItem.notes && (
                                              <p className="text-gray-600 mt-1">{historyItem.notes}</p>
                                            )}
                                            <p className="text-gray-500 text-xs mt-1">
                                              {new Date(historyItem.created_at).toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    {validation.status === 'pending' && (
                                      <div className="flex gap-2 mt-4">
                                        <textarea
                                          placeholder="Add notes about this validation..."
                                          className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custodia/50"
                                          rows={2}
                                          id={`notes-${validation.id}`}
                                        />
                                        <div className="flex flex-col gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-green-600 border-green-600 hover:bg-green-50"
                                            onClick={() => {
                                              const notes = (document.getElementById(`notes-${validation.id}`) as HTMLTextAreaElement)?.value;
                                              handleValidationAction(validation.id, 'approved', notes);
                                            }}
                                          >
                                            Approve with Notes
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 border-red-600 hover:bg-red-50"
                                            onClick={() => {
                                              const notes = (document.getElementById(`notes-${validation.id}`) as HTMLTextAreaElement)?.value;
                                              handleValidationAction(validation.id, 'rejected', notes);
                                            }}
                                          >
                                            Reject with Notes
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
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

export default AdminDashboard;
