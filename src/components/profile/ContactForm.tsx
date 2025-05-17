import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

type ContactFormProps = {
  profileId: string;
  profileName: string;
  contactEmail: string;
};

type FormData = {
  senderName: string;
  senderEmail: string;
  message: string;
};

const ContactForm: React.FC<ContactFormProps> = ({ profileId, profileName, contactEmail }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      // Log request details for debugging
      console.log('Sending request to:', `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`);
      console.log('Request data:', {
        ...data,
        recipientEmail: contactEmail,
      });

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          ...data,
          recipientEmail: contactEmail,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      toast.success('Message sent successfully!');
      reset();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
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
        label="Your Email"
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
      <Textarea
        label="Message"
        {...register('message', {
          required: 'Message is required',
          minLength: {
            value: 10,
            message: 'Message must be at least 10 characters',
          },
        })}
        error={errors.message?.message}
        rows={5}
      />
      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Your message will be sent directly to the performer's email. They will be able to reply to you directly.
      </p>
    </form>
  );
};

export default ContactForm;