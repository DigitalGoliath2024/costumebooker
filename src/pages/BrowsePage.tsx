import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProfileGrid from '../components/profile/ProfileGrid';
import LocationFilter from '../components/profile/LocationFilter';
import CategoryFilter from '../components/profile/CategoryFilter';
import { supabase } from '../lib/supabase';
import { STATES, type Profile } from '../types';

const BrowsePage: React.FC = () => {
  const { stateAbbr } = useParams<{ stateAbbr?: string }>();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(stateAbbr || '');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        
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
          .eq('payment_status', 'paid');

        if (selectedState) {
          query = query.eq('state', selectedState);
        }

        if (selectedCity) {
          query = query.eq('city', selectedCity);
        }

        const { data, error } = await query;

        if (error) throw error;

        let filteredProfiles = data.map((item: any) => ({
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

        // Filter by categories if any are selected
        if (selectedCategories.length > 0) {
          filteredProfiles = filteredProfiles.filter((profile) =>
            profile.categories.some((category) =>
              selectedCategories.includes(category)
            )
          );
        }

        setProfiles(filteredProfiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [selectedState, selectedCity, selectedCategories]);

  // For demo purposes, using placeholder data
  const placeholderProfiles: Profile[] = [
    {
      id: '1',
      displayName: 'Captain Marvel',
      bio: 'Professional superhero cosplayer with 5+ years of experience',
      state: 'CA',
      city: 'Los Angeles',
      priceMin: 150,
      priceMax: 300,
      facebook: 'captainmarvel',
      instagram: 'captainmarvel',
      tiktok: 'captainmarvel',
      twitter: 'captainmarvel',
      isActive: true,
      paymentStatus: 'paid',
      paymentExpiry: '2025-12-31',
      categories: ['Hero', 'Comic Book Character'],
      images: [
        {
          id: '1-1',
          url: 'https://images.pexels.com/photos/6942436/pexels-photo-6942436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          position: 0,
        },
      ],
    },
    {
      id: '2',
      displayName: 'Joker',
      bio: 'Award-winning villain cosplayer available for events',
      state: 'NY',
      city: 'New York City',
      priceMin: 200,
      priceMax: 400,
      facebook: 'joker',
      instagram: 'joker',
      tiktok: null,
      twitter: 'joker',
      isActive: true,
      paymentStatus: 'paid',
      paymentExpiry: '2025-12-31',
      categories: ['Villain', 'Comic Book Character'],
      images: [
        {
          id: '2-1',
          url: 'https://images.pexels.com/photos/8107206/pexels-photo-8107206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          position: 0,
        },
      ],
    },
    {
      id: '3',
      displayName: 'Princess Zelda',
      bio: 'Video game character cosplayer specializing in fantasy worlds',
      state: 'WA',
      city: 'Seattle',
      priceMin: 125,
      priceMax: 250,
      facebook: 'zelda',
      instagram: 'zelda',
      tiktok: 'zelda',
      twitter: null,
      isActive: true,
      paymentStatus: 'paid',
      paymentExpiry: '2025-12-31',
      categories: ['Video Game Character', 'Fantasy'],
      images: [
        {
          id: '3-1',
          url: 'https://images.pexels.com/photos/7144180/pexels-photo-7144180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          position: 0,
        },
      ],
    },
    {
      id: '4',
      displayName: 'Naruto',
      bio: 'Anime cosplayer with authentic costume and character portrayal',
      state: 'FL',
      city: 'Miami',
      priceMin: 100,
      priceMax: 200,
      facebook: 'naruto',
      instagram: 'naruto',
      tiktok: 'naruto',
      twitter: 'naruto',
      isActive: true,
      paymentStatus: 'paid',
      paymentExpiry: '2025-12-31',
      categories: ['Anime/Manga'],
      images: [
        {
          id: '4-1',
          url: 'https://images.pexels.com/photos/12454899/pexels-photo-12454899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          position: 0,
        },
      ],
    },
  ];

  // Filter placeholder profiles based on selected filters
  let filteredPlaceholderProfiles = placeholderProfiles;
  
  if (selectedState) {
    filteredPlaceholderProfiles = filteredPlaceholderProfiles.filter(
      (profile) => profile.state === selectedState
    );
  }
  
  if (selectedCity) {
    filteredPlaceholderProfiles = filteredPlaceholderProfiles.filter(
      (profile) => profile.city === selectedCity
    );
  }
  
  if (selectedCategories.length > 0) {
    filteredPlaceholderProfiles = filteredPlaceholderProfiles.filter((profile) =>
      profile.categories.some((category) => selectedCategories.includes(category))
    );
  }

  // Use real data if available, otherwise use placeholder data
  const displayProfiles = profiles.length > 0 ? profiles : filteredPlaceholderProfiles;

  // Get state name for display
  const stateName = selectedState 
    ? STATES.find(state => state.abbreviation === selectedState)?.name 
    : 'All States';

  return (
    <Layout>
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
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-gray-600">
                      {displayProfiles.length} {displayProfiles.length === 1 ? 'performer' : 'performers'} found
                    </p>
                  </div>
                  
                  <ProfileGrid 
                    profiles={displayProfiles} 
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