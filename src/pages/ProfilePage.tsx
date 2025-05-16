import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, DollarSign, Facebook, Instagram, Twitter, Check, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ImageGallery from '../components/profile/ImageGallery';
import ContactForm from '../components/profile/ContactForm';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/utils';
import { TRAVEL_RADIUS_OPTIONS } from '../types';
import type { Profile } from '../types';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      
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
            travel_radius,
            available_for_travel,
            available_virtual,
            require_travel_expenses,
            require_deposit,
            bring_own_costume,
            perform_outdoors,
            require_dressing_room,
            family_friendly_only,
            adult_themes_ok,
            group_performer,
            background_check,
            contact_email,
            profile_categories (category),
            profile_images (id, image_url, position)
          `)
          .eq('id', id)
          .eq('is_active', true)
          .eq('payment_status', 'paid')
          .single();

        if (error) throw error;

        const profileData: Profile = {
          id: data.id,
          displayName: data.display_name,
          bio: data.bio,
          state: data.state,
          city: data.city,
          priceMin: data.price_min,
          priceMax: data.price_max,
          facebook: data.facebook,
          instagram: data.instagram,
          tiktok: data.tiktok,
          twitter: data.twitter,
          isActive: data.is_active,
          paymentStatus: data.payment_status,
          paymentExpiry: data.payment_expiry,
          categories: data.profile_categories.map((c: any) => c.category),
          images: data.profile_images.map((img: any) => ({
            id: img.id,
            url: img.image_url,
            position: img.position,
          })),
          travelRadius: data.travel_radius,
          availableForTravel: data.available_for_travel,
          availableVirtual: data.available_virtual,
          requireTravelExpenses: data.require_travel_expenses,
          requireDeposit: data.require_deposit,
          bringOwnCostume: data.bring_own_costume,
          performOutdoors: data.perform_outdoors,
          requireDressingRoom: data.require_dressing_room,
          familyFriendlyOnly: data.family_friendly_only,
          adultThemesOk: data.adult_themes_ok,
          groupPerformer: data.group_performer,
          backgroundCheck: data.background_check,
          contactEmail: data.contact_email,
        };

        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-500">Loading profile...</p>
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Profile Not Found
            </h2>
            <p className="text-gray-500 mb-8">
              This profile may have been removed or is no longer active.
            </p>
            <Link to="/browse">
              <Button>Browse Other Performers</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const travelRadiusLabel = TRAVEL_RADIUS_OPTIONS.find(
    option => option.value === profile.travelRadius
  )?.label;

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link to="/browse" className="text-purple-700 hover:text-purple-800">
              &larr; Back to Browse
            </Link>
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
                  {profile.displayName}
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
                  <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
                </div>

                {/* Travel & Availability */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Travel & Availability</h2>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Travel Range</h3>
                      <p className="text-gray-600">{travelRadiusLabel}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        {profile.availableForTravel ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="text-gray-700">Available for travel</span>
                      </div>
                      
                      <div className="flex items-center">
                        {profile.availableVirtual ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="text-gray-700">Virtual appearances</span>
                      </div>
                      
                      {profile.availableForTravel && (
                        <>
                          <div className="flex items-center">
                            {profile.requireTravelExpenses ? (
                              <Check className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <span className="text-gray-700">Requires travel expenses</span>
                          </div>
                          
                          <div className="flex items-center">
                            {profile.requireDeposit ? (
                              <Check className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <span className="text-gray-700">Requires deposit</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance Details */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Details</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        {profile.bringOwnCostume ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="text-gray-700">Brings own costume</span>
                      </div>
                      
                      <div className="flex items-center">
                        {profile.performOutdoors ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="text-gray-700">Performs outdoors</span>
                      </div>
                      
                      <div className="flex items-center">
                        {profile.requireDressingRoom ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="text-gray-700">Requires dressing room</span>
                      </div>
                      
                      <div className="flex items-center">
                        {profile.familyFriendlyOnly ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="text-gray-700">Family-friendly only</span>
                      </div>
                      
                      <div className="flex items-center">
                        {profile.adultThemesOk ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="text-gray-700">Adult themes OK</span>
                      </div>
                      
                      <div className="flex items-center">
                        {profile.groupPerformer ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="text-gray-700">Group performer</span>
                      </div>
                      
                      <div className="flex items-center">
                        {profile.backgroundCheck ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="text-gray-700">Background check available</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Social Links */}
                {(profile.facebook || profile.instagram || profile.twitter || profile.tiktok) && (
                  <div className="mt-8">
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
            
            {/* Right Column - Contact Form */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <ContactForm 
                    profileId={profile.id} 
                    profileName={profile.displayName}
                    contactEmail={profile.contactEmail}
                  />
                </CardContent>
              </Card>
              
              <div className="mt-6 bg-purple-50 rounded-lg p-4">
                <h3 className="font-medium text-purple-800 mb-2">Booking Information</h3>
                <p className="text-sm text-purple-700 mb-4">
                  This performer is available for events in the {profile.city}, {profile.state} area
                  {profile.availableForTravel && ' and is willing to travel'}.
                </p>
                <p className="text-xs text-gray-500">
                  This site does not process payments or bookings. Please coordinate directly with the performer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;