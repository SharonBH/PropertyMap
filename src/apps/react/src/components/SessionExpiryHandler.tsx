import React, { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Component that listens for session expiry events and shows user notifications
 * This component should be mounted at the app root level
 */
const SessionExpiryHandler: React.FC = () => {
  useEffect(() => {
    const handleSessionExpiredToast = () => {
      toast({
        title: "פג תוקף ההתחברות",
        description: "אנא התחבר מחדש כדי להמשיך",
        variant: "destructive",
        duration: 5000,
      });
    };

    window.addEventListener('auth:show-session-expired-toast', handleSessionExpiredToast);
    
    return () => {
      window.removeEventListener('auth:show-session-expired-toast', handleSessionExpiredToast);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default SessionExpiryHandler;
