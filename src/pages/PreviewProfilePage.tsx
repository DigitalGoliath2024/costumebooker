import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Facebook, Instagram, Twitter } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ImageGallery from '../components/profile/ImageGallery';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/utils';
import type { Profile } from '../types';

const PreviewProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        
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
            is_active,
            payment_status,
            payment_expiry,
            profile_categories (category),
            profile_images (id, image_url, position)
          `)
          .eq('id', user.id)
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const profileData = data[0];
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
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-500">Loading preview...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Complete Your Profile First
            </h2>
            <p className="text-gray-600 mb-6">
              Please complete your profile information before previewing.
            </p>
            <Link to="/dashboard/edit-profile">
              <Button>Complete Profile</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isProfileComplete = profile.displayName && profile.bio && profile.state && profile.city && profile.categories.length > 0;

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex justify-between items-center">
            <Link to="/dashboard" className="text-purple-700 hover:text-purple-800">
              &larr; Back to Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                Preview Mode
              </div>
              {isProfileComplete ? (
                <Link to="/dashboard/subscription">
                  <Button>Activate Listing</Button>
                </Link>
              ) : (
                <Link to="/dashboard/edit-profile">
                  <Button>Complete Profile</Button>
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-2">
              <ImageGallery 
                images={profile.images} 
                alt={profile.displayName} 
              />
              
              <div className="mt-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.displayName || 'Display Name Required'}
                </h1>
                
                <div className="flex flex-wrap items-center text-gray-500 mb-4">
                  <div className="flex items-center mr-6 mb-2">
                    <MapPin className="h-5 w-5 mr-1" />
                    <span>{profile.city}, {profile.state}</span>
                  </div>
                  
                  {(profile.priceMin !== null && profile.priceMax !== null) && (
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-5 w-5 mr-1" />
                      <span>{formatCurrency(profile.priceMin)} - {formatCurrency(profile.priceMax)} / hour</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {profile.categories.map((category) => (
                    <Badge key={category} variant="default">
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
                  <p className="text-gray-700 whitespace-pre-line">{profile.bio || 'Bio Required'}</p>
                </div>
                
                {/* Social Links */}
                {(profile.facebook || profile.instagram || profile.twitter || profile.tiktok) && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Connect</h2>
                    <div className="flex space-x-4">
                      {profile.facebook && (
                        <a 
                          href={`https://facebook.com/${profile.facebook}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Facebook className="h-6 w-6" />
                        </a>
                      )}
                      {profile.instagram && (
                        <a 
                          href={`https://instagram.com/${profile.instagram}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-800"
                        >
                          <Instagram className="h-6 w-6" />
                        </a>
                      )}
                      {profile.twitter && (
                        <a 
                          href={`https://twitter.com/${profile.twitter}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-600"
                        >
                          <Twitter className="h-6 w-6" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column - Contact Form Preview */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Contact Form
                  </h3>
                  <p className="text-gray-600 mb-4">
                    The contact form will be available here once your listing is activated.
                  </p>
                  <div className="space-y-4 opacity-50 pointer-events-none">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      disabled
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      disabled
                    />
                    <textarea
                      placeholder="Message"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={4}
                      disabled
                    ></textarea>
                    <Button className="w-full" disabled>
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 bg-purple-50 rounded-lg p-4">
                <h3 className="font-medium text-purple-800 mb-2">Preview Notice</h3>
                <p className="text-sm text-purple-700 mb-4">
                  This is a preview of how your profile will appear to visitors. Activate your listing to make it visible in our directory.
                </p>
                {!isProfileComplete && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-1">Required Fields:</h4>
                    <ul className="text-sm text-yellow-700 list-disc list-inside">
                      {!profile.displayName && <li>Display Name</li>}
                      {!profile.bio && <li>Bio</li>}
                      {!profile.state && <li>State</li>}
                      {!profile.city && <li>City</li>}
                      {profile.categories.length === 0 && <li>At least one category</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PreviewProfilePage;