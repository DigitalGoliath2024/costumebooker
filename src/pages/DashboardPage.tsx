import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Image, DollarSign, User, LogOut, Eye, Shield, Trash2, Check, AlertTriangle } from 'lucide-react';
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
  address: string;
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
  const [showSafetyInfo, setShowSafetyInfo] = useState(false);

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

          // Fetch inquiries
          const { data: inquiriesData, error: inquiriesError } = await supabase
            .from('contact_messages')
            .select('*')
            .eq('profile_id', user.id)
            .order('created_at', { ascending: false });

          if (inquiriesError) throw inquiriesError;
          setInquiries(inquiriesData || []);
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

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMarkAsRead = async (inquiryId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', inquiryId);

      if (error) throw error;

      setInquiries(inquiries.map(inquiry =>
        inquiry.id === inquiryId ? { ...inquiry, is_read: true } : inquiry
      ));
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error marking inquiry as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', inquiryId);

      if (error) throw error;

      setInquiries(inquiries.filter(inquiry => inquiry.id !== inquiryId));
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry(null);
        setShowInquiryDetails(false);
      }
      toast.success('Inquiry deleted');
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast.error('Failed to delete inquiry');
    }
  };

  const hasProfile = !!profile;
  const isProfileComplete = hasProfile && profile.displayName && profile.bio && profile.state && profile.city;
  const isPaid = profile?.paymentStatus === 'paid';

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
                    {isPaid && profile?.paymentExpiry && (
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
              {/* Profile Status Card */}
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
                      <h3 className="text-l