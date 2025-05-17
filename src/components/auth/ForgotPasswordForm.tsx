import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

type ForgotPasswordFormValues = {
  email: string;
};

const ForgotPasswordForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>();

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset link sent to your email!');
    } catch (error: any) {
      console.error('Error sending reset link:', error);
      toast.error(error.message || 'Failed to send reset link');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
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
      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;