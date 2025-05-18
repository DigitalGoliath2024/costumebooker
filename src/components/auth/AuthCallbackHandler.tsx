import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const AuthCallbackHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const type = params.get('type');

      if (!token || !type) return;

      try {
        if (type === 'recovery') {
          // Verify the recovery token
          const { error } = await supabase.auth.verifyOtp({
            token,
            type: 'recovery'
          });

          if (error) throw error;

          // Clean URL and redirect to reset password
          window.history.replaceState({}, document.title, '/reset-password?type=recovery');
          navigate('/reset-password?type=recovery');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        toast.error('Invalid or expired recovery link');
        navigate('/signin');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return null;
};

export default AuthCallbackHandler;