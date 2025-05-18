import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>();
  
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = async () => {
      try {
        setIsLoading(true);
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          throw new Error('Invalid or expired reset link');
        }

        // Verify this is a recovery session
        const params = new URLSearchParams(window.location.search);
        if (params.get('type') !== 'recovery') {
          throw new Error('Invalid reset link type');
        }
      } catch (error: any) {
        console.error('Error validating session:', error);
        toast.error('Invalid or expired reset link');
        navigate('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [navigate]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) throw error;

      // Clear the session after password reset
      await supabase.auth.signOut();
      
      toast.success('Password updated successfully! Please sign in with your new password.');
      navigate('/signin');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Failed to reset password');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Verifying reset link...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="New Password"
        type="password"
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
        error={errors.password?.message}
      />
      <Input
        label="Confirm Password"
        type="password"
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (value) =>
            value === watch('password') || 'Passwords do not match',
        })}
        error={errors.confirmPassword?.message}
      />
      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Updating Password...' : 'Update Password'}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;