import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Tag, Shield } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import ProfileGrid from '../components/profile/ProfileGrid';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { redirectToCheckout } from '../lib/stripe';
import { STATES, type Profile } from '../types';
import toast from 'react-hot-toast';

const HERO_IMAGES = [
  'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
  'https://images.pexels.com/photos/7144180/pexels-photo-7144180.jpeg',
  'https://images.pexels.com/photos/6942436/pexels-photo-6942436.jpeg',
  'https://images.pexels.com/photos/8107206/pexels-photo-8107206.jpeg'
];

const HomePage: React.FC = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [featuredProfiles, setFeaturedProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
          .order('created_at', { ascending: false })
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
            images: item.profile_images
              .filter((img: any) => img.image_url) // Filter out any null URLs
              .sort((a: any, b: any) => a.position - b.position)
              .map((img: any) => ({
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

  return (
    <Layout>
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

      {/* Featured Performers */}
      <section className="bg-accent-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-accent-900 mb-4">
              Featured Performers
            </h2>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto">
              Discover our top costumed performers available for events, parties, and conventions
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
            <ProfileGrid profiles={featuredProfiles} />
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
                <p className="text-white/90 mb-4">Marvel, DC, and more</p>
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
    </Layout>
  );
};

export default HomePage;