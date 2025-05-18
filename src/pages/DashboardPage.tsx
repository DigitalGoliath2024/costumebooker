import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Image, DollarSign, User, LogOut, Eye, Shield, Trash2, Check, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { Profile } from '../types';

type Inquiry = {
  id: string;
  created_at: string;
  sender_name: string;
  sender_email: string;
  message: string;
  is_read: boolean;
  event_type: string[];
  phone_number: string;
  city: string;
  state: string;
  zip: string;
};

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showInquiryDetails, setShowInquiryDetails] = useState(false);
  const [deletingInquiryId, setDeletingInquiryId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if user is admin
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        setIsAdmin(roleData?.role === 'admin');
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            id,
            display_name,
            bio,
            state,
            city,
            price_min,
            price_max,
            facebook,
            instagram,
            tiktok,
            twitter,
            contact_email,
            is_active,
            payment_status,
            payment_expiry,
            profile_categories (category),
            profile_images (id, image_url, position)
          `)
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData) {
          setProfile({
            id: profileData.id,
            displayName: profileData.display_name,
            bio: profileData.bio,
            state: profileData.state,
            city: profileData.city,
            priceMin: profileData.price_min,
            priceMax: profileData.price_max,
            facebook: profileData.facebook,
            instagram: profileData.instagram,
            tiktok: profileData.tiktok,
            twitter: profileData.twitter,
            contactEmail: profileData.contact_email,
            isActive: profileData.is_active,
            paymentStatus: profileData.payment_status,
            paymentExpiry: profileData.payment_expiry,
            categories: profileData.profile_categories.map((c: any) => c.category),
            images: profileData.profile_images.map((img: any) => ({
              id: img.id,
              url: img.image_url,
              position: img.position,
            })),
          });

          await fetchInquiries(user.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const fetchInquiries = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error: any) {
      console.error('Error fetching inquiries:', error);
      toast.error(error.message || 'Failed to load inquiries');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMarkAsRead = async (inquiryId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', inquiryId)
        .eq('profile_id', user.id);

      if (error) throw error;

      // Update local state
      setInquiries(prevInquiries => 
        prevInquiries.map(inquiry =>
          inquiry.id === inquiryId ? { ...inquiry, is_read: true } : inquiry
        )
      );

      toast.success('Marked as read');
    } catch (error: any) {
      console.error('Error marking inquiry as read:', error);
      toast.error(error.message || 'Failed to mark as read');
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!user || !window.confirm('Are you sure you want to delete this inquiry?')) {
      return;
    }

    try {
      setDeletingInquiryId(inquiryId);

      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .match({
          id: inquiryId,
          profile_id: user.id
        });

      if (error) throw error;

      // Update local state
      setInquiries(prevInquiries => prevInquiries.filter(inquiry => inquiry.id !== inquiryId));
      
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry(null);
        setShowInquiryDetails(false);
      }

      toast.success('Inquiry deleted successfully');

      // Refresh inquiries to ensure UI is in sync
      await fetchInquiries(user.id);
    } catch (error: any) {
      console.error('Error deleting inquiry:', error);
      toast.error(error.message || 'Failed to delete inquiry');
      
      // Refresh inquiries to ensure UI is in sync with database
      await fetchInquiries(user.id);
    } finally {
      setDeletingInquiryId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your cosplay performer profile
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              <Button onClick={handleSignOut} variant="outline" className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column - Account Info */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Status</p>
                      <div className="mt-1 flex items-center">
                        <Badge variant={profile?.paymentStatus === 'paid' ? 'success' : 'warning'}>
                          {profile?.paymentStatus === 'paid' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    {profile?.paymentStatus === 'paid' && profile?.paymentExpiry && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Subscription Expires</p>
                        <p className="mt-1">{new Date(profile.paymentExpiry).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-1">
                    <Link
                      to="/dashboard/edit-profile"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-purple-700 hover:bg-purple-50"
                    >
                      <Edit className="mr-3 h-5 w-5 text-purple-500" />
                      Edit Profile
                    </Link>
                    <Link
                      to="/dashboard/manage-images"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-purple-700 hover:bg-purple-50"
                    >
                      <Image className="mr-3 h-5 w-5 text-purple-500" />
                      Manage Images
                    </Link>
                    <Link
                      to="/dashboard/subscription"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-purple-700 hover:bg-purple-50"
                    >
                      <DollarSign className="mr-3 h-5 w-5 text-purple-500" />
                      Manage Subscription
                    </Link>
                    {profile?.paymentStatus === 'paid' && (
                      <Link
                        to={`/profile/${profile.id}`}
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-purple-700 hover:bg-purple-50"
                      >
                        <User className="mr-3 h-5 w-5 text-purple-500" />
                        View Public Profile
                      </Link>
                    )}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Profile Status & Inquiries */}
            <div className="lg:col-span-2">
              {/* Profile Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {!profile ? (
                    <div className="text-center py-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Complete Your Profile
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Create your cosplay performer profile to get started. Once your profile is complete, you can activate your listing.
                      </p>
                      <Link to="/dashboard/edit-profile">
                        <Button>Create Profile</Button>
                      </Link>
                    </div>
                  ) : !profile.displayName || !profile.bio || !profile.state || !profile.city ? (
                    <div className="bg-yellow-50 p-4 rounded-md mb-6">
                      <h3 className="text-lg font-medium text-yellow-800 mb-2">
                        Profile Incomplete
                      </h3>
                      <p className="text-yellow-700 mb-4">
                        Your profile is missing some required information. Please complete all required fields.
                      </p>
                      <Link to="/dashboard/edit-profile">
                        <Button variant="outline">Complete Profile</Button>
                      </Link>
                    </div>
                  ) : profile.paymentStatus !== 'paid' ? (
                    <div className="bg-blue-50 p-4 rounded-md mb-6">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">
                        Activate Your Listing
                      </h3>
                      <p className="text-blue-700 mb-4">
                        Your profile is complete! Activate your listing for $29/year to make it visible in our directory.
                      </p>
                      <Link to="/dashboard/subscription">
                        <Button>Activate Listing</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-md mb-6">
                      <h3 className="text-lg font-medium text-green-800 mb-2">
                        Listing Active
                      </h3>
                      <p className="text-green-700 mb-4">
                        Your listing is active and visible in our directory. Your subscription will renew on {new Date(profile.paymentExpiry || '').toLocaleDateString()}.
                      </p>
                      <Link to={`/profile/${profile.id}`}>
                        <Button variant="outline">View Public Profile</Button>
                      </Link>
                    </div>
                  )}

                  {/* Profile Completion Checklist */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Profile Completion Checklist
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${profile?.displayName ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Display Name</p>
                          <p className="text-sm text-gray-500">
                            {profile?.displayName || 'Add your cosplay performer name'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${profile?.bio ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Bio</p>
                          <p className="text-sm text-gray-500">
                            {profile?.bio ? 'Bio added' : 'Add a description of your cosplay services'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${profile?.state && profile?.city ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Location</p>
                          <p className="text-sm text-gray-500">
                            {profile?.city && profile?.state 
                              ? `${profile.city}, ${profile.state}` 
                              : 'Add your location'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${profile?.categories?.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Categories</p>
                          <p className="text-sm text-gray-500">
                            {profile?.categories?.length > 0 
                              ? `${profile.categories.length} categories selected` 
                              : 'Select your cosplay categories'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${profile?.images?.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Images</p>
                          <p className="text-sm text-gray-500">
                            {profile?.images?.length > 0 
                              ? `${profile.images.length} images uploaded` 
                              : 'Upload cosplay images (up to 4)'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${profile?.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Payment</p>
                          <p className="text-sm text-gray-500">
                            {profile?.paymentStatus === 'paid'
                              ? `Paid through ${new Date(profile?.paymentExpiry || '').toLocaleDateString()}` 
                              : 'Activate your listing ($29/year)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inquiries Card */}
              {profile && (
                <Card className="mt-8">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Inquiries</CardTitle>
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-gray-600">
                          Be sure to follow best safety practices when contacting potential clients.
                        </p>
                        <Link to="/safety-first">
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Safety Guide
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showInquiryDetails && selectedInquiry ? (
                      <div className="space-y-6">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowInquiryDetails(false);
                            setSelectedInquiry(null);
                          }}
                          className="mb-4"
                        >
                          Back to List
                        </Button>
                        
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">From</h4>
                              <p className="text-gray-900">{selectedInquiry.sender_name}</p>
                              <p className="text-gray-600">{selectedInquiry.sender_email}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Contact Info</h4>
                              <p className="text-gray-900">{selectedInquiry.phone_number}</p>
                              <p className="text-gray-600">{selectedInquiry.city}, {selectedInquiry.state} {selectedInquiry.zip}</p>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Event Types</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedInquiry.event_type.map((type) => (
                                <Badge key={type} variant="secondary">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Message</h4>
                            <div className="bg-white p-4 rounded-md border border-gray-200">
                              <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          {!selectedInquiry.is_read && (
                            <Button
                              onClick={() => handleMarkAsRead(selectedInquiry.id)}
                              className="flex items-center"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Read
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                            disabled={deletingInquiryId === selectedInquiry.id}
                            className="flex items-center text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingInquiryId === selectedInquiry.id ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {inquiries.length === 0 ? (
                          <div className="text-center py-6">
                            <p className="text-gray-500">No inquiries yet</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    From
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Event Types
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {inquiries.map((inquiry) => (
                                  <tr
                                    key={inquiry.id}
                                    className={`hover:bg-gray-50 ${!inquiry.is_read ? 'bg-blue-50' : ''}`}
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {new Date(inquiry.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900">
                                        {inquiry.sender_name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {inquiry.sender_email}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex flex-wrap gap-1">
                                        {inquiry.event_type.map((type) => (
                                          <Badge key={type} variant="secondary">
                                            {type}
                                          </Badge>
                                        ))}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <Badge
                                        variant={inquiry.is_read ? 'success' : 'warning'}
                                      >
                                        {inquiry.is_read ? 'Read' : 'Unread'}
                                      </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <div className="flex justify-end space-x-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedInquiry(inquiry);
                                            setShowInquiryDetails(true);
                                          }}
                                          className="text-purple-600 hover:text-purple-700"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                        {!inquiry.is_read && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleMarkAsRead(inquiry.id)}
                                            className="text-green-600 hover:text-green-700"
                                          >
                                            <Check className="h-4 w-4" />
                                          </Button>
                                        )}
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDeleteInquiry(inquiry.id)}
                                          disabled={deletingInquiryId === inquiry.id}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;