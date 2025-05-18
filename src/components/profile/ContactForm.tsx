import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

type ContactFormProps = {
  profileId: string;
  profileName: string;
};

type FormData = {
  senderName: string;
  senderEmail: string;
  phoneNumber: string;
  city: string;
  state: string;
  zip: string;
  message: string;
  eventTypes: string[];
  captchaAnswer: string;
};

const EVENT_TYPES = [
  'Birthday Party',
  'Corporate Event',
  'Private Booking',
  'Convention Appearance',
  'School Event',
  'Photo Shoot',
  'Meet and Greet',
];

const ContactForm: React.FC<ContactFormProps> = ({ profileId, profileName }) => {
  const [captchaNumbers, setCaptchaNumbers] = useState(() => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    return { num1, num2, sum: num1 + num2 };
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      eventTypes: [],
    }
  });

  const selectedEventTypes = watch('eventTypes') || [];

  const onSubmit = async (data: FormData) => {
    try {
      // Validate captcha
      if (parseInt(data.captchaAnswer) !== captchaNumbers.sum) {
        toast.error('Incorrect captcha answer');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/contact_messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          profile_id: profileId,
          sender_name: data.senderName,
          sender_email: data.senderEmail,
          phone_number: data.phoneNumber,
          city: data.city,
          state: data.state,
          zip: data.zip,
          message: data.message,
          event_type: data.eventTypes,
          captcha_answer: parseInt(data.captchaAnswer),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      toast.success('Inquiry submitted successfully!');
      reset();
      
      // Generate new captcha numbers
      const num1 = Math.floor(Math.random() * 9) + 1;
      const num2 = Math.floor(Math.random() * 9) + 1;
      setCaptchaNumbers({ num1, num2, sum: num1 + num2 });
    } catch (error: any) {
      console.error('Error submitting inquiry:', error);
      toast.error(error.message || 'Failed to submit inquiry');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Contact {profileName}
      </h3>
      
      <Input
        label="Your Name"
        {...register('senderName', { required: 'Name is required' })}
        error={errors.senderName?.message}
      />
      
      <Input
        label="Email Address"
        type="email"
        {...register('senderEmail', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
        error={errors.senderEmail?.message}
      />
      
      <Input
        label="Phone Number"
        type="tel"
        {...register('phoneNumber', {
          required: 'Phone number is required',
          pattern: {
            value: /^\+?[\d\s-()]+$/,
            message: 'Invalid phone number',
          },
        })}
        error={errors.phoneNumber?.message}
      />
      
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="City"
          {...register('city', { required: 'City is required' })}
          error={errors.city?.message}
        />
        <Input
          label="State"
          {...register('state', { required: 'State is required' })}
          error={errors.state?.message}
        />
        <Input
          label="ZIP Code"
          {...register('zip', { required: 'ZIP code is required' })}
          error={errors.zip?.message}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Event Type (select all that apply)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EVENT_TYPES.map((type) => (
            <Checkbox
              key={type}
              label={type}
              checked={selectedEventTypes.includes(type)}
              onChange={(e) => {
                const newEventTypes = e.target.checked
                  ? [...selectedEventTypes, type]
                  : selectedEventTypes.filter((t) => t !== type);
                setValue('eventTypes', newEventTypes, { shouldValidate: true });
              }}
            />
          ))}
        </div>
        {errors.eventTypes && (
          <p className="text-sm text-red-500">{errors.eventTypes.message}</p>
        )}
      </div>

      <Textarea
        label="Message (max 500 characters)"
        {...register('message', {
          required: 'Message is required',
          maxLength: {
            value: 500,
            message: 'Message cannot exceed 500 characters',
          },
        })}
        error={errors.message?.message}
        rows={4}
      />

      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Please solve this math problem: {captchaNumbers.num1} + {captchaNumbers.num2} = ?
        </label>
        <Input
          type="number"
          {...register('captchaAnswer', {
            required: 'Please answer the math problem',
          })}
          error={errors.captchaAnswer?.message}
        />
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Submitting...' : 'Send Inquiry'}
        </Button>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Your inquiry will be sent directly to the performer. They will contact you using the provided information.
      </p>
    </form>
  );
};

export default ContactForm;