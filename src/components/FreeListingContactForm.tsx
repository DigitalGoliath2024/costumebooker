import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload } from 'lucide-react';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import { STATES } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  website: string;
  experience: string;
  paidEvents: string;
  eventTypes: string;
  characters: string;
  bio: string;
  travel: string;
  whyJoin: string;
  questions: string;
};

const FreeListingContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('free_listing_requests')
        .insert({
          full_name: data.fullName,
          email: data.email,
          phone: data.phone || null,
          city: data.city,
          state: data.state,
          instagram: data.instagram || null,
          facebook: data.facebook || null,
          youtube: data.youtube || null,
          tiktok: data.tiktok || null,
          website: data.website || null,
          experience: data.experience,
          paid_events: data.paidEvents,
          event_types: data.eventTypes || null,
          characters: data.characters || null,
          bio: data.bio,
          travel: data.travel,
          why_join: data.whyJoin || null,
          questions: data.questions || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Application submitted successfully! We\'ll review it and get back to you soon.');
      reset();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Info</h2>
        <div className="space-y-4">
          <Input
            label="Full Name"
            {...register('fullName', { required: 'Full name is required' })}
            error={errors.fullName?.message}
          />
          <Input
            label="Email Address"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />
          <Input
            label="Phone Number (optional)"
            type="tel"
            {...register('phone')}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🔹 Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City"
            {...register('city', { required: 'City is required' })}
            error={errors.city?.message}
          />
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
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🔹 Social Media / Online Presence
        </h2>
        <div className="space-y-4">
          <Input
            label="Instagram Handle"
            {...register('instagram')}
            placeholder="@username"
          />
          <Input
            label="Facebook Page or Profile"
            {...register('facebook')}
            placeholder="URL or username"
          />
          <Input
            label="YouTube Channel"
            {...register('youtube')}
            placeholder="Channel URL"
          />
          <Input
            label="TikTok Handle"
            {...register('tiktok')}
            placeholder="@username"
          />
          <Input
            label="Website or Portfolio Link"
            {...register('website')}
            placeholder="https://"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🔹 Experience & Availability
        </h2>
        <div className="space-y-4">
          <Select
            label="How long have you been performing or doing cosplay?"
            {...register('experience', { required: 'Please select an option' })}
            error={errors.experience?.message}
            options={[
              { value: '', label: 'Select experience level' },
              { value: '0-1', label: '0-1 year' },
              { value: '1-3', label: '1-3 years' },
              { value: '3+', label: '3+ years' },
            ]}
          />
          <Select
            label="Have you done paid events before?"
            {...register('paidEvents', { required: 'Please select an option' })}
            error={errors.paidEvents?.message}
            options={[
              { value: '', label: 'Select an option' },
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
          <Textarea
            label="Tell us about the types of events you've performed at"
            {...register('eventTypes')}
            placeholder="Birthday parties, conventions, school events, etc."
          />
          <Textarea
            label="List any notable characters you portray"
            {...register('characters')}
            placeholder="List your main character types and costumes"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🔹 About You</h2>
        <div className="space-y-4">
          <Textarea
            label="Brief bio/introduction – tell us who you are and what makes your act unique"
            {...register('bio', { required: 'Bio is required' })}
            error={errors.bio?.message}
          />
          <Select
            label="Are you available for local travel or willing to travel within your state?"
            {...register('travel', { required: 'Please select an option' })}
            error={errors.travel?.message}
            options={[
              { value: '', label: 'Select an option' },
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'depends', label: 'Depends on distance/event' },
            ]}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🔹 Final Section
        </h2>
        <div className="space-y-4">
          <Textarea
            label="Why do you want to join CostumeCameos.com? (Optional)"
            {...register('whyJoin')}
          />
          <Textarea
            label="Any questions or notes you'd like to share with us?"
            {...register('questions')}
          />
        </div>
      </section>

      <div className="pt-6 border-t border-gray-200">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
        <p className="mt-4 text-sm text-gray-500 text-center">
          We'll review your application and get back to you within 1-2 business days.
        </p>
      </div>
    </form>
  );
};

export default FreeListingContactForm;