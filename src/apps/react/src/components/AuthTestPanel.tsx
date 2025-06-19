import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * Development component to test authentication flows
 * Remove this in production
 */
const AuthTestPanel: React.FC = () => {
  const simulateSessionExpiry = () => {
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpiryTime');
    localStorage.removeItem('currentAgent');
    
    // Trigger session expired event
    window.dispatchEvent(new CustomEvent('auth:session-expired'));
  };

  const simulateNetworkError = () => {
    window.dispatchEvent(new CustomEvent('auth:network-error'));
  };

  const simulate401Error = () => {
    // Simulate a 401 response by making a request with an invalid token
    localStorage.setItem('authToken', 'invalid-token-for-testing');
    
    // This will trigger a 401 when the next API call is made
    window.location.reload();
  };

  if (import.meta.env.MODE === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <Alert className="mb-3">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>מצב פיתוח:</strong> פאנל בדיקת אימות
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Button 
          onClick={simulateSessionExpiry} 
          variant="destructive" 
          size="sm" 
          className="w-full"
        >
          <ShieldAlert className="h-3 w-3 mr-1" />
          סימולציה: פג תוקף
        </Button>
        
        <Button 
          onClick={simulate401Error} 
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          סימולציה: 401 Error
        </Button>
        
        <Button 
          onClick={simulateNetworkError} 
          variant="secondary" 
          size="sm" 
          className="w-full"
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          סימולציה: שגיאת רשת
        </Button>
      </div>
    </div>
  );
};

export default AuthTestPanel;
