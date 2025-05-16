import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Checkbox from '../components/ui/Checkbox';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { STATES, CATEGORIES, TRAVEL_RADIUS_OPTIONS } from '../types';
import toast from 'react-hot-toast';

type ProfileFormData = {
  displayName: string;
  bio: string;
  state: string;
  city: string;
  priceMin: string;
  priceMax: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  twitter: string;
  contactEmail: string;
  categories: string[];
  travelRadius: string;
  availableForTravel: boolean;
  availableVirtual: boolean;
  requireTravelExpenses: boolean;
  requireDeposit: boolean;
  bringOwnCostume: boolean;
  performOutdoors: boolean;
  requireDressingRoom: boolean;
  familyFriendlyOnly: boolean;
  adultThemesOk: boolean;
  groupPerformer: boolean;
  backgroundCheck: boolean;
};

const EditProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: profileId } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>();

  const watchState = watch('state');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    // Check if user is admin when editing another profile
    const checkAdminStatus = async () => {
      if (profileId && profileId !== user.id) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (data?.role !== 'admin') {
          navigate('/dashboard');
          return;
        }
        setIsAdmin(true);
      }
    };

    checkAdminStatus();

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select(`
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
            profile_categories (category)
          `)
          .eq('id', profileId || user.id)
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const profile = data[0];
          setValue('displayName', profile.display_name || '');
          setValue('bio', profile.bio || '');
          setValue('state', profile.state || '');
          setValue('city', profile.city || '');
          setValue('priceMin', profile.price_min?.toString() || '');
          setValue('priceMax', profile.price_max?.toString() || '');
          setValue('facebook', profile.facebook || '');
          setValue('instagram', profile.instagram || '');
          setValue('tiktok', profile.tiktok || '');
          setValue('twitter', profile.twitter || '');
          setValue('contactEmail', profile.contact_email || '');
          setValue('travelRadius', profile.travel_radius || 'local_only');
          setValue('availableForTravel', profile.available_for_travel || false);
          setValue('availableVirtual', profile.available_virtual || false);
          setValue('requireTravelExpenses', profile.require_travel_expenses || false);
          setValue('requireDeposit', profile.require_deposit || false);
          setValue('bringOwnCostume', profile.bring_own_costume || true);
          setValue('performOutdoors', profile.perform_outdoors || true);
          setValue('requireDressingRoom', profile.require_dressing_room || false);
          setValue('familyFriendlyOnly', profile.family_friendly_only || false);
          setValue('adultThemesOk', profile.adult_themes_ok || false);
          setValue('groupPerformer', profile.group_performer || false);
          setValue('backgroundCheck', profile.background_check || false);
          setSelectedState(profile.state || '');
          setSelectedCategories(profile.profile_categories.map((c: any) => c.category));
        } else {
          // Set default values for new profiles
          setValue('contactEmail', user.email || '');
          setValue('travelRadius', 'local_only');
          setValue('bringOwnCostume', true);
          setValue('performOutdoors', true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate, setValue, profileId]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: profileId || user.id,
          display_name: data.displayName,
          bio: data.bio,
          state: data.state,
          city: data.city,
          price_min: data.priceMin ? parseInt(data.priceMin) : null,
          price_max: data.priceMax ? parseInt(data.priceMax) : null,
          facebook: data.facebook || null,
          instagram: data.instagram || null,
          tiktok: data.tiktok || null,
          twitter: data.twitter || null,
          contact_email: data.contactEmail,
          travel_radius: data.travelRadius,
          available_for_travel: data.availableForTravel,
          available_virtual: data.availableVirtual,
          require_travel_expenses: data.requireTravelExpenses,
          require_deposit: data.requireDeposit,
          bring_own_costume: data.bringOwnCostume,
          perform_outdoors: data.performOutdoors,
          require_dressing_room: data.requireDressingRoom,
          family_friendly_only: data.familyFriendlyOnly,
          adult_themes_ok: data.adultThemesOk,
          group_performer: data.groupPerformer,
          background_check: data.backgroundCheck,
        });

      if (profileError) throw profileError;

      // Delete existing categories
      const { error: deleteError } = await supabase
        .from('profile_categories')
        .delete()
        .eq('profile_id', profileId || user.id);

      if (deleteError) throw deleteError;

      // Insert new categories
      if (selectedCategories.length > 0) {
        const { error: categoriesError } = await supabase
          .from('profile_categories')
          .insert(
            selectedCategories.map(category => ({
              profile_id: profileId || user.id,
              category,
            }))
          );

        if (categoriesError) throw categoriesError;
      }

      toast.success('Profile updated successfully!');
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-500">Loading profile data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const selectedStateObj = STATES.find(state => state.abbreviation === watchState);
  const cityOptions = selectedStateObj
    ? [{ value: '', label: 'Select a city' }, ...selectedStateObj.cities.map(city => ({ value: city, label: city }))]
    : [{ value: '', label: 'Select a state first' }];

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to={isAdmin ? "/admin" : "/dashboard"} className="text-purple-700 hover:text-purple-800">
              &larr; Back to {isAdmin ? "Admin Dashboard" : "Dashboard"}
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {isAdmin ? 'Edit Profile' : profileId ? 'Complete Your Profile' : 'Edit Profile'}
            </h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                  <div className="space-y-4">
                    <Input
                      label="Display Name"
                      {...register('displayName', { required: 'Display name is required' })}
                      error={errors.displayName?.message}
                    />
                    <Input
                      label="Contact Email"
                      type="email"
                      {...register('contactEmail', {
                        required: 'Contact email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      error={errors.contactEmail?.message}
                    />
                    <Textarea
                      label="Bio"
                      {...register('bio', {
                        required: 'Bio is required',
                        minLength: {
                          value: 100,
                          message: 'Bio must be at least 100 characters',
                        },
                      })}
                      error={errors.bio?.message}
                      rows={5}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="State"
                      {...register('state', { required: 'State is required' })}
                      error={errors.state?.message}
                      options={[
                        { value: '', label: 'Select a state' },
                        ...STATES.map(state => ({
                          value: state.abbreviation,
                          label: state.name,
                        })),
                      ]}
                    />
                    <Select
                      label="City"
                      {...register('city', { required: 'City is required' })}
                      error={errors.city?.message}
                      options={cityOptions}
                      disabled={!watchState}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Travel & Availability</h2>
                  <div className="space-y-4">
                    <Select
                      label="Travel Radius"
                      {...register('travelRadius')}
                      options={TRAVEL_RADIUS_OPTIONS}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Checkbox
                        label="Available for travel gigs"
                        {...register('availableForTravel')}
                      />
                      <Checkbox
                        label="Available for virtual appearances"
                        {...register('availableVirtual')}
                      />
                      <Checkbox
                        label="Require travel reimbursement"
                        {...register('requireTravelExpenses')}
                      />
                      <Checkbox
                        label="Require deposit upfront"
                        {...register('requireDeposit')}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Checkbox
                      label="Bring own props/costume setup"
                      {...register('bringOwnCostume')}
                    />
                    <Checkbox
                      label="Will perform outdoors"
                      {...register('performOutdoors')}
                    />
                    <Checkbox
                      label="Require a dressing area"
                      {...register('requireDressingRoom')}
                    />
                    <Checkbox
                      label="Family-friendly character only"
                      {...register('familyFriendlyOnly')}
                    />
                    <Checkbox
                      label="Willing to do adult-themed events"
                      {...register('adultThemesOk')}
                    />
                    <Checkbox
                      label="Open to working with other performers"
                      {...register('groupPerformer')}
                    />
                    <Checkbox
                      label="Background check available"
                      {...register('backgroundCheck')}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Minimum Price (per hour)"
                      type="number"
                      {...register('priceMin', {
                        min: {
                          value: 0,
                          message: 'Price cannot be negative',
                        },
                      })}
                      error={errors.priceMin?.message}
                    />
                    <Input
                      label="Maximum Price (per hour)"
                      type="number"
                      {...register('priceMax', {
                        min: {
                          value: 0,
                          message: 'Price cannot be negative',
                        },
                      })}
                      error={errors.priceMax?.message}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Facebook Username"
                      {...register('facebook')}
                      placeholder="username"
                    />
                    <Input
                      label="Instagram Username"
                      {...register('instagram')}
                      placeholder="username"
                    />
                    <Input
                      label="TikTok Username"
                      {...register('tiktok')}
                      placeholder="username"
                    />
                    <Input
                      label="Twitter Username"
                      {...register('twitter')}
                      placeholder="username"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {CATEGORIES.map((category) => (
                      <label
                        key={category}
                        className={`
                          flex items-center p-3 rounded-lg border cursor-pointer
                          ${selectedCategories.includes(category)
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-200'}
                        `}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedCategories.length === 0 && (
                    <p className="mt-2 text-sm text-red-500">
                      Please select at least one category
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <Link to={isAdmin ? "/admin" : "/dashboard"}>
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting || selectedCategories.length === 0}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfilePage;