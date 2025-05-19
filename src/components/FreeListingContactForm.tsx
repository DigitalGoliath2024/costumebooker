import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload } from 'lucide-react';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import { STATES } from '../types';

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
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/free-listing', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Show success message and redirect
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🔹 Proof of Experience
        </h2>
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-6">
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <Upload className="h-12 w-12 text-gray-400" />
              <span className="mt-2 text-sm text-gray-600">
                Upload photos, testimonials, or booking proof
              </span>
              <span className="mt-1 text-xs text-gray-500">
                (JPG, PNG, PDF up to 10MB each)
              </span>
            </label>
          </div>
          {files.length > 0 && (
            <ul className="text-sm text-gray-600">
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
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