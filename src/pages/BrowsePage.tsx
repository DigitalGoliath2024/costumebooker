import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProfileGrid from '../components/profile/ProfileGrid';
import LocationFilter from '../components/profile/LocationFilter';
import CategoryFilter from '../components/profile/CategoryFilter';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';
import { STATES, type Profile } from '../types';
import toast from 'react-hot-toast';

const BrowsePage: React.FC = () => {
  const { stateAbbr } = useParams<{ stateAbbr?: string }>();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState(stateAbbr || '');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Get state name for display and SEO
  const stateName = selectedState 
    ? STATES.find(state => state.abbreviation === selectedState)?.name 
    : 'All States';

  // Build SEO title and description
  const seoTitle = selectedState && selectedCity
    ? `Find Cosplay Performers in ${selectedCity}, ${selectedState}`
    : selectedState
    ? `Find Cosplay Performers in ${stateName}`
    : 'Find Cosplay Performers Near You';

  const seoDescription = selectedState && selectedCity
    ? `Book talented cosplay performers, character actors, and costume entertainers in ${selectedCity}, ${selectedState}. Browse local performers for birthday parties, events, and conventions.`
    : selectedState
    ? `Find and hire cosplay performers and character entertainers in ${stateName}. Browse local talent for parties, events, conventions, and special occasions.`
    : 'Connect with professional cosplay performers and character entertainers near you. Browse local talent for birthday parties, conventions, and special events across the United States.';

  // Build JSON-LD schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seoTitle,
    description: seoDescription,
    provider: {
      '@type': 'Organization',
      name: 'CostumeCameos',
      url: 'https://costumecameos.com'
    },
    ...(selectedState && {
      areaServed: {
        '@type': 'State',
        name: stateName,
        ...(selectedCity && {
          containsPlace: {
            '@type': 'City',
            name: selectedCity
          }
        })
      }
    })
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
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
          .eq('is_active', true)
          .eq('payment_status', 'paid')
          .not('display_name', 'is', null);

        if (selectedState) {
          query = query.eq('state', selectedState);
        }

        if (selectedCity) {
          query = query.eq('city', selectedCity);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error('Database error:', fetchError);
          throw new Error('Failed to fetch profiles');
        }

        if (!data) {
          setProfiles([]);
          return;
        }

        const mappedProfiles: Profile[] = data.map(item => ({
          id: item.id,
          displayName: item.display_name,
          bio: item.bio,
          state: item.state,
          city: item.city,
          priceMin: item.price_min,
          priceMax: item.price_max,
          facebook: item.facebook,
          instagram: item.instagram,
          tiktok: item.tiktok,
          twitter: item.twitter,
          isActive: item.is_active,
          paymentStatus: item.payment_status,
          paymentExpiry: item.payment_expiry,
          categories: item.profile_categories.map((c: any) => c.category),
          images: item.profile_images.map((img: any) => ({
            id: img.id,
            url: img.image_url,
            position: img.position,
          })),
        }));

        let filteredProfiles = mappedProfiles;
        if (selectedCategories.length > 0) {
          filteredProfiles = mappedProfiles.filter((profile) =>
            profile.categories.some((category) =>
              selectedCategories.includes(category)
            )
          );
        }

        setProfiles(filteredProfiles);
      } catch (error: any) {
        console.error('Error fetching profiles:', error);
        setError(error.message);
        toast.error('Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [selectedState, selectedCity, selectedCategories]);

  return (
    <Layout>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={`https://costumecameos.com/browse${selectedState ? `/${selectedState}` : ''}`}
        jsonLd={jsonLd}
      />

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedState && selectedCity
                  ? `Cosplay Performers in ${selectedCity}, ${selectedState}`
                  : selectedState
                  ? `Cosplay Performers in ${stateName}`
                  : 'Browse All Cosplay Performers'}
              </h1>
              <p className="text-gray-600">
                Find and connect with talented cosplay performers for your events
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="w-full lg:w-1/4 space-y-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
                
                <div className="space-y-6">
                  <LocationFilter
                    selectedState={selectedState}
                    selectedCity={selectedCity}
                    onStateChange={setSelectedState}
                    onCityChange={setSelectedCity}
                  />
                  
                  <hr className="my-6" />
                  
                  <CategoryFilter
                    selectedCategories={selectedCategories}
                    onChange={setSelectedCategories}
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="w-full lg:w-3/4">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading profiles...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-gray-600">
                      {profiles.length} {profiles.length === 1 ? 'performer' : 'performers'} found
                    </p>
                  </div>
                  
                  <ProfileGrid 
                    profiles={profiles} 
                    emptyMessage={
                      selectedCategories.length > 0 || selectedState || selectedCity
                        ? "No performers found matching your filters. Try adjusting your criteria."
                        : "No performers found. Check back soon as our directory grows!"
                    }
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BrowsePage;