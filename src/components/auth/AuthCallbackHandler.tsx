import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const AuthCallbackHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const hash = window.location.hash;
      
      if (!hash) return;

      try {
        // Parse the hash parameters
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (accessToken && refreshToken && type === 'recovery') {
          // Set the session with the tokens
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) throw error;

          // Clean URL and redirect to reset password
          window.history.replaceState({}, document.title, '/reset-password?type=recovery');
          navigate('/reset-password?type=recovery');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        toast.error(error.message || 'Authentication error');
        navigate('/signin');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return null;
};

export default AuthCallbackHandler;