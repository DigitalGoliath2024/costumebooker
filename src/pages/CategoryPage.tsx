import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProfileGrid from '../components/profile/ProfileGrid';
import LocationFilter from '../components/profile/LocationFilter';
import { supabase } from '../lib/supabase';
import { CATEGORIES, type Profile } from '../types';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName?: string }>();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const decodedCategory = categoryName ? decodeURIComponent(categoryName) : '';
  const isValidCategory = CATEGORIES.includes(decodedCategory as any);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!isValidCategory && categoryName) return;
      
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

        // Filter by category if specified
        if (decodedCategory) {
          filteredProfiles = filteredProfiles.filter((profile) =>
            profile.categories.includes(decodedCategory)
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
  }, [categoryName, decodedCategory, isValidCategory, selectedState, selectedCity]);

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

  // Filter placeholder profiles based on selected filters and category
  let filteredPlaceholderProfiles = placeholderProfiles;
  
  if (decodedCategory) {
    filteredPlaceholderProfiles = filteredPlaceholderProfiles.filter((profile) =>
      profile.categories.includes(decodedCategory)
    );
  }
  
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

  // Use real data if available, otherwise use placeholder data
  const displayProfiles = profiles.length > 0 ? profiles : filteredPlaceholderProfiles;

  if (categoryName && !isValidCategory) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The category "{categoryName}" does not exist. Please check the URL and try again.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {decodedCategory ? `${decodedCategory} Performers` : 'All Categories'}
              </h1>
              <p className="text-gray-600">
                {decodedCategory
                  ? `Find and connect with talented ${decodedCategory.toLowerCase()} performers for your events`
                  : 'Browse performers by category'}
              </p>
            </div>
          </div>

          {!decodedCategory ? (
            // Categories grid when no specific category is selected
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORIES.map((category) => (
                <a
                  key={category}
                  href={`/categories/${encodeURIComponent(category)}`}
                  className="group relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 h-48"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-primary-600 to-primary-700 opacity-90 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_70%)] transition-opacity duration-300"></div>
                  <div className="relative h-full flex flex-col items-center justify-center p-6 text-center transform group-hover:scale-[1.02] transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{category}</h3>
                    <p className="text-white/90 mb-4">Find {category.toLowerCase()} performers</p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                      View Category
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            // Profile listing when a specific category is selected
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
                        selectedState || selectedCity
                          ? `No ${decodedCategory.toLowerCase()} performers found matching your location filters. Try adjusting your criteria.`
                          : `No ${decodedCategory.toLowerCase()} performers found. Check back soon as our directory grows!`
                      }
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;