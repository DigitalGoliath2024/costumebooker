import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Check, Shield } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { redirectToCheckout } from '../lib/stripe';
import { supabase } from '../lib/supabase';

const ManageSubscriptionPage: React.FC = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('payment_status, payment_expiry')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubscribe = async () => {
    try {
      setCheckoutError(null);
      
      if (!session?.access_token) {
        // Save the current URL to redirect back after login
        navigate('/signin', { 
          state: { 
            redirect: location.pathname,
            message: 'Please sign in to continue with your subscription.' 
          }
        });
        return;
      }

      await redirectToCheckout('YEARLY_MEMBERSHIP', session.access_token);
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      setCheckoutError(error.message || 'Failed to start checkout process');
    }
  };

  const features = [
    'Professional profile listing',
    'Upload up to 4 high-quality images',
    'Detailed bio and services description',
    'Location-based visibility',
    'Category-based search inclusion',
    'Direct client inquiries',
    'Social media links',
    'Automatic yearly renewal',
  ];

  if (loading) {
    return (
      <Layout>
        <div className="bg-gray-50 min-h-screen py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-500">Loading subscription details...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // If user is logged in and has an active subscription
  if (user && profile?.payment_status === 'paid') {
    return (
      <Layout>
        <div className="bg-gray-50 min-h-screen py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link to="/dashboard" className="text-purple-700 hover:text-purple-800">
                &larr; Back to Dashboard
              </Link>
            </div>

            <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-premium text-white p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Active Subscription</h2>
                  <div className="text-3xl font-bold">$29</div>
                </div>
                <p className="text-white/90">
                  Your subscription is active until {new Date(profile.payment_expiry).toLocaleDateString()}
                </p>
              </div>

              <div className="p-8">
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <p className="text-green-700 font-medium">Your listing is active and visible to potential clients</p>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    Your subscription will automatically renew on {new Date(profile.payment_expiry).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-2" />
                    Secure payment processing by Stripe
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Default view for non-subscribed users
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {user && (
            <div className="mb-8">
              <Link to="/dashboard" className="text-purple-700 hover:text-purple-800">
                &larr; Back to Dashboard
              </Link>
            </div>
          )}

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get Discovered by Clients
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our directory of talented performers and connect with clients looking for unique entertainment
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-premium text-white p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Yearly Membership</h2>
                <div className="text-3xl font-bold">$29</div>
              </div>
              <p className="text-white/90">
                per year, billed annually
              </p>
            </div>

            <div className="p-8">
              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {checkoutError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {checkoutError}
                </div>
              )}

              <Button
                onClick={handleSubscribe}
                className="w-full mb-6"
                size="lg"
              >
                Subscribe Now
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Subscription renews automatically. Cancel anytime.
                </p>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2" />
                  Secure payment processing by Stripe
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What's included in my membership?
                  </h3>
                  <p className="text-gray-600">
                    Your membership includes a professional profile listing with up to 4 images, detailed bio, pricing information, and direct client inquiries. You'll be discoverable through location and category searches.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How do bookings and payments work?
                  </h3>
                  <p className="text-gray-600">
                    We don't handle bookings or payments between performers and clients. We simply connect you with potential clients who can reach out through our platform. You manage your own bookings, rates, and payment arrangements directly with clients.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I cancel my subscription?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can cancel your subscription at any time. Your listing will remain active until the end of your current billing period. No refunds are provided for partial periods.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What happens when my subscription renews?
                  </h3>
                  <p className="text-gray-600">
                    Your subscription will automatically renew each year at $29. You'll receive a reminder email before renewal, and you can cancel anytime to prevent automatic renewal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageSubscriptionPage;