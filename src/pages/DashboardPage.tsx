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
        
        const { data, error } = await supabase
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
          .limit(1);

        if (error) {
          throw error;
        }

        // Check if we have data and it contains at least one profile
        if (data && data.length > 0) {
          const profileData = data[0];
          const mappedProfile: Profile = {
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
          };
          setProfile(mappedProfile);
        } else {
          // No profile found - this is a valid case for new users
          setProfile(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
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

  // For demo purposes, using placeholder data if no profile exists
  const placeholderProfile: Profile = {
    id: user?.id || '1',
    displayName: 'Your Cosplay Name',
    bio: 'Your bio will appear here once you complete your profile.',
    state: '',
    city: '',
    priceMin: null,
    priceMax: null,
    facebook: null,
    instagram: null,
    tiktok: null,
    twitter: null,
    contactEmail: user?.email || '',
    isActive: false,
    paymentStatus: 'unpaid',
    paymentExpiry: null,
    categories: [],
    images: [],
  };

  // Use real data if available, otherwise use placeholder data
  const displayProfile = profile || placeholderProfile;
  const hasProfile = !!profile;
  const isProfileComplete = hasProfile && displayProfile.displayName && displayProfile.bio && displayProfile.state && displayProfile.city;
  const isPaid = displayProfile.paymentStatus === 'paid';

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
                    {isPaid && displayProfile.paymentExpiry && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Subscription Expires</p>
                        <p className="mt-1">{new Date(displayProfile.paymentExpiry).toLocaleDateString()}</p>
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
                        to={`/profile/${displayProfile.id}`}
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

            {/* Right Column - Profile Status */}
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
                        Your listing is active and visible in our directory. Your subscription will renew on {new Date(displayProfile.paymentExpiry || '').toLocaleDateString()}.
                      </p>
                      <Link to={`/profile/${displayProfile.id}`}>
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
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${displayProfile.displayName ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Display Name</p>
                          <p className="text-sm text-gray-500">
                            {displayProfile.displayName || 'Add your cosplay performer name'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${displayProfile.bio ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Bio</p>
                          <p className="text-sm text-gray-500">
                            {displayProfile.bio ? 'Bio added' : 'Add a description of your cosplay services'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${displayProfile.state && displayProfile.city ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Location</p>
                          <p className="text-sm text-gray-500">
                            {displayProfile.city && displayProfile.state 
                              ? `${displayProfile.city}, ${displayProfile.state}` 
                              : 'Add your location'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${displayProfile.categories.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Categories</p>
                          <p className="text-sm text-gray-500">
                            {displayProfile.categories.length > 0 
                              ? `${displayProfile.categories.length} categories selected` 
                              : 'Select your cosplay categories'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${displayProfile.images.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Images</p>
                          <p className="text-sm text-gray-500">
                            {displayProfile.images.length > 0 
                              ? `${displayProfile.images.length} images uploaded` 
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
                              ? `Paid through ${new Date(displayProfile.paymentExpiry || '').toLocaleDateString()}` 
                              : 'Activate your listing ($29/year)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <p className="text-sm text-gray-500 mb-4">
                      Need help with your profile? Contact our support team at support@cosplayconnect.com
                    </p>
                    <Link to="/dashboard/edit-profile">
                      <Button className="w-full">
                        {hasProfile ? 'Edit Profile' : 'Create Profile'}
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;