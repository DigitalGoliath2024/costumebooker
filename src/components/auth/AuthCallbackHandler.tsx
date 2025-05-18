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
        // Check if this is a recovery flow
        const params = new URLSearchParams(window.location.search);
        const isRecovery = params.get('type') === 'recovery';

        if (isRecovery) {
          // Get the session - if valid, we're already authenticated
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            // Clean URL and redirect to reset password
            window.history.replaceState({}, document.title, '/reset-password?type=recovery');
            navigate('/reset-password?type=recovery');
          } else {
            throw new Error('Invalid or expired recovery link');
          }
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