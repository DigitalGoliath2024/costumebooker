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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 🔧 Step 1: Handle token from URL on page load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const queryParams = new URLSearchParams(hash.substring(1));
      const access_token = queryParams.get('access_token');
      const refresh_token = queryParams.get('refresh_token');

      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
          if (error) {
            toast.error('Invalid or expired recovery token.');
            console.error('Session error:', error);
            navigate('/signin');
          } else {
            setLoading(false); // Session restored, show form
          }
        });
      } else {
        toast.error('Missing recovery token.');
        navigate('/signin');
      }
    } else {
      toast.error('No recovery token in URL.');
      navigate('/signin');
    }
  }, [navigate]);

  // 🔐 Step 2: Handle form submission
  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) throw error;

      await supabase.auth.signOut();
      toast.success('Password updated successfully! Please sign in.');
      navigate('/signin');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Failed to reset password');
    }
  };

  if (loading) {
    return <p className="text-center py-6">Verifying token...</p>;
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
