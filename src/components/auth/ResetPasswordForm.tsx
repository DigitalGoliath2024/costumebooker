import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>();
  
  const navigate = useNavigate();

  useEffect(() => {
    const validateResetToken = async () => {
      try {
        const type = searchParams.get('type');
        
        // Check if this is a recovery flow
        if (type !== 'recovery') {
          throw new Error('Invalid reset link');
        }

        // Get the session to validate the token
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          throw error || new Error('Invalid or expired reset link');
        }

      } catch (error: any) {
        console.error('Error validating reset token:', error);
        toast.error('Invalid or expired reset link');
        navigate('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    validateResetToken();
  }, [navigate, searchParams]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      
      // Sign out to ensure clean state
      await supabase.auth.signOut();
      
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