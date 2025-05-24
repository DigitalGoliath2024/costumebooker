import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Tag, Shield } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import ProfileGrid from '../components/profile/ProfileGrid';
import SEO from '../components/SEO';
import HomePagePopup from '../components/HomePagePopup';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { redirectToCheckout } from '../lib/stripe';
import { STATES, type Profile } from '../types';
import toast from 'react-hot-toast';

const HERO_IMAGES = [
  'https://i.ibb.co/TQnDCqP/20250516-1245-Easter-Bunny-Celebration-simple-compose-01jvczrnw9e7hbv0zp7eeb0vmk.png',
  'https://i.ibb.co/Lzf28zTd/20250516-1210-Cosplay-Wizard-Party-simple-compose-01jvcxnspke3q9wmndgqez1wx2.png',
  'https://i.ibb.co/NnyXcNbg/20250516-1227-Superhero-Birthday-Surprise-simple-compose-01jvcyn50ff1ht3a9v3vqvcsvr.png',
  'https://i.ibb.co/ccjLqGVC/20250516-1255-Sci-Fi-Party-Poses-simple-compose-01jvd0abe2ewtam65fbeyex063.png'
];

const HomePage: React.FC = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [featuredProfiles, setFeaturedProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CostumeCameos",
    "url": "https://costumecameos.com",
    "description": "Connect with cosplay performers, superheroes, anime characters, and more for your events across the United States.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://costumecameos.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === HERO_IMAGES.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchFeaturedProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
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
          .limit(8);

        if (supabaseError) {
          throw supabaseError;
        }

        if (data) {
          const profiles: Profile[] = data.map((item: any) => ({
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
          setFeaturedProfiles(profiles);
        }
      } catch (err: any) {
        console.error('Error fetching featured profiles:', err);
        setError(err.message || 'Failed to fetch profiles');
        setFeaturedProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProfiles();
  }, []);

  const handleSubscribe = async () => {
    try {
      if (!session?.access_token) {
        navigate('/signin', { 
          state: { 
            redirect: '/dashboard/subscription',
            message: 'Please sign in to continue with your subscription.' 
          }
        });
        return;
      }

      await redirectToCheckout('YEARLY_MEMBERSHIP', session.access_token);
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message || 'Failed to start checkout process');
    }
  };

  // For demo purposes, using placeholder data
  const placeholderProfiles: Profile[] = [
    {
      id: '1',
      displayName: 'Test Profile',
      bio: 'Professional superhero cosplayer with 5+ years of experience',
      state: 'CA',
      city: 'Los Angeles',
      priceMin: 150,
      priceMax: 300,
      facebook: 'captainm',
      instagram: 'captail',
      tiktok: 'captainl',
      twitter: 'captain',
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
      displayName: 'Test Profile 2',
      bio: 'Award-winning villain cosplayer available for events',
      state: 'NY',
      city: 'New York City',
      priceMin: 200,
      priceMax: 400,
      facebook: 'jokes',
      instagram: 'jokes',
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
      displayName: 'Princess Tester',
      bio: 'Video game character cosplayer specializing in fantasy worlds',
      state: 'WA',
      city: 'Seattle',
      priceMin: 125,
      priceMax: 250,
      facebook: 'c',
      instagram: 'c',
      tiktok: 'c',
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
      displayName: 'Test Profile 3',
      bio: 'Anime cosplayer with authentic costume and character portrayal',
      state: 'FL',
      city: 'Miami',
      priceMin: 100,
      priceMax: 200,
      facebook: 'n',
      instagram: 'n',
      tiktok: 'n',
      twitter: 'n',
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

  // Use real data if available, otherwise use placeholder data
  const displayProfiles = featuredProfiles.length > 0 ? featuredProfiles : placeholderProfiles;

  return (
    <Layout>
      <SEO 
        title="Find Cosplay Performers Near You"
        description="Connect with professional cosplay performers, superheroes, anime characters, and more for your events. Browse our directory of talented performers across the United States."
        canonicalUrl="https://costumecameos.com"
        jsonLd={jsonLd}
      />
      
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden mt-5">
        {HERO_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Find the Perfect Costumed Performer for Your Event
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Connect with professional cosplayers, superheroes, anime characters, and more across the United States.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/browse">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    <MapPin className="mr-2 h-5 w-5" />
                    Browse by Location
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30">
                    <Tag className="mr-2 h-5 w-5" />
                    Browse by Category
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Listing Promotion Section */}
      <section className="bg-gradient-premium py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-4">
              🎭 Limited Time Opportunity
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              First 150 Qualified Listings are FREE!
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Are you a talented cosplay performer? Join our growing community and get discovered by clients in your area. 
              No subscription fees, no hidden costs.
            </p>
            <Link to="/free-listing">
              <Button 
                size="lg" 
                variant="secondary"
                className="animate-pulse hover:animate-none"
              >
                📩 Apply for Your Free Listing Now
              </Button>
            </Link>
            <p className="mt-4 text-sm text-white/80">
              *Limited spots available. Must meet our quality and safety guidelines.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 border-b border-accent-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-accent-900">
                Find Costumed Performers Near You
              </h2>
              <p className="text-accent-600">
                Browse our directory of talented performers by location or category
              </p>
            </div>
            <Link to="/search">
              <Button className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Advanced Search
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Performers */}
      <section className="bg-accent-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-accent-900 mb-4">
              Featured Performers
            </h2>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto">
              Discover our top costumed performers available for events, parties, and conventions. 
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-accent-500">Loading featured performers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <ProfileGrid profiles={displayProfiles} />
          )}

          <div className="text-center mt-10">
            <Link to="/browse">
              <Button size="lg">View All Performers</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-accent-900 mb-4">
              Browse by State
            </h2>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto">
              Find costumed performers in your area
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {STATES.map((state) => (
              <Link
                key={state.abbreviation}
                to={`/browse/${state.abbreviation}`}
                className="p-3 text-center rounded-md hover:bg-accent-50 transition-colors"
              >
                <div className="font-medium text-accent-900">{state.name}</div>
                <div className="text-sm text-accent-500">{state.cities.length} cities</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-accent-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-accent-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto">
              Find the perfect performer for your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/categories/Hero" className="group relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all">
              <div className="absolute inset-0 bg-gradient-premium opacity-80 group-hover:opacity-90 transition-opacity"></div>
              <div className="relative p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Superheroes</h3>
                <p className="text-white/90 mb-4">Cinema, comics, history and more</p>
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  Browse Heroes
                </Button>
              </div>
            </Link>
            
            <Link to="/categories/Villain" className="group relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all">
              <div className="absolute inset-0 bg-gradient-accent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              <div className="relative p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Villains</h3>
                <p className="text-white/90 mb-4">Iconic bad guys and antagonists</p>
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  Browse Villains
                </Button>
              </div>
            </Link>
            
            <Link to="/categories/Anime%2FManga" className="group relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all">
              <div className="absolute inset-0 bg-gradient-premium opacity-80 group-hover:opacity-90 transition-opacity"></div>
              <div className="relative p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Anime Characters</h3>
                <p className="text-white/90 mb-4">From your favorite anime series</p>
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  Browse Anime
                </Button>
              </div>
            </Link>
          </div>

          <div className="text-center mt-10">
            <Link to="/categories">
              <Button size="lg">View All Categories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-premium text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Are You a Costumed Performer?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
              Join our directory to connect with fans and event organizers. Create your listing today for just $29 per year.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleSubscribe}
            >
              Create Your Listing
            </Button>
          </div>
        </div>
      </section>

      <HomePagePopup />
    </Layout>
  );
};

export default HomePage;