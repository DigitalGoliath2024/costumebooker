import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

type SignInFormValues = {
  email: string;
  password: string;
};

const SignInForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>();
  
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const onSubmit = async (data: SignInFormValues) => {
    try {
      await signIn(data.email, data.password);
      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Failed to sign in. Please check your credentials.');
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
      <Input
        label="Password"
        type="password"
        {...register('password', {
          required: 'Password is required',
        })}
        error={errors.password?.message}
      />
      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          className="text-sm text-purple-700 hover:text-purple-800"
        >
          Forgot password?
        </Link>
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </div>
    </form>
  );
};

export default SignInForm;