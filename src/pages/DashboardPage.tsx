import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Image, DollarSign, User, LogOut, Eye, Shield } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchProfile = async () => {
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
        }

        // Fetch inquiries
        const { data: inquiriesData, error: inquiriesError } = await supabase
          .from('contact_messages')
          .select('*')
          .eq('profile_id', user.id)
          .order('created_at', { ascending: false });

        if (inquiriesError) throw inquiriesError;
        setInquiries(inquiriesData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
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

  const hasProfile = !!profile;
  const isProfileComplete = hasProfile && profile.displayName && profile.bio && profile.state && profile.city;
  const isPaid = profile?.paymentStatus === 'paid';

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your cosplay performer profile
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                        <Badge variant={isPaid ? 'success' : 'warning'}>
                          {isPaid ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    {isPaid && profile?.paymentExpiry && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Subscription Expires</p>
                        <p className="mt-1">{new Date(profile.paymentExpiry).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </CardFooter>
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
                      to="/dashboard/preview"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-purple-700 hover:bg-purple-50"
                    >
                      <Eye className="mr-3 h-5 w-5 text-purple-500" />
                      Preview Profile
                    </Link>
                    <Link
                      to="/dashboard/subscription"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-purple-700 hover:bg-purple-50"
                    >
                      <DollarSign className="mr-3 h-5 w-5 text-purple-500" />
                      Manage Subscription
                    </Link>
                    {isPaid && (
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
              <Card>
                <CardHeader>
                  <CardTitle>Profile Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {!hasProfile ? (
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
                  ) : !isProfileComplete ? (
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
                  ) : !isPaid ? (
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
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${isPaid ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Payment</p>
                          <p className="text-sm text-gray-500">
                            {isPaid 
                              ? `Paid through ${new Date(profile?.paymentExpiry || '').toLocaleDateString()}` 
                              : 'Activate your listing ($29/year)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Inquiries */}
              {hasProfile && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recent Inquiries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {inquiries.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No inquiries yet</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Event Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {inquiries.map((inquiry) => (
                              <tr key={inquiry.id} className="hover:bg-gray-50">
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
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-wrap gap-1">
                                    {inquiry.event_type.map((type: string) => (
                                      <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {type}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    inquiry.is_read
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {inquiry.is_read ? 'Read' : 'Unread'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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