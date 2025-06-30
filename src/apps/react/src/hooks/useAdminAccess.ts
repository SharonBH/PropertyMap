import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContextTypes';
import { getMeEndpoint, getUserRolesEndpoint } from '@/api/homemapapi';

export const useAdminAccess = () => {
  const authContext = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!authContext) {
    throw new Error('useAdminAccess must be used within an AuthProvider');
  }

  const { currentAgent, isAuthenticated } = authContext;

  useEffect(() => {
    const checkAdminPermissions = async () => {
      if (!isAuthenticated || !currentAgent) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // Get user details
        const userDetails = await getMeEndpoint();
        
        if (!userDetails.id) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Get user roles
        const userRoles = await getUserRolesEndpoint(userDetails.id);
        
        // Check if user has admin role
        const hasAdminRole = userRoles.some(role => role.roleName === 'Admin') || false;
        
        setIsAdmin(hasAdminRole);
      } catch (error) {
        console.error('Failed to check admin permissions:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminPermissions();
  }, [isAuthenticated, currentAgent]);

  return { isAdmin, isLoading };
};
