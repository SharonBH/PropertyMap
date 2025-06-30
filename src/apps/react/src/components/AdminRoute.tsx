import { ReactNode, useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContextTypes';
import { Navigate } from 'react-router-dom';
import { getMeEndpoint, getUserRolesEndpoint } from '@/api/homemapapi';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminRouteProps {
  children: ReactNode;
  requiredPermission?: string;
}

const AdminRoute = ({ children, requiredPermission }: AdminRouteProps) => {
  const authContext = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  if (!authContext) {
    throw new Error('AdminRoute must be used within an AuthProvider');
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
        
        // For now, we'll just check for admin role
        // In the future, you can implement specific permission checking here
        setIsAdmin(hasAdminRole);
      } catch (error) {
        console.error('Error checking admin permissions:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminPermissions();
  }, [isAuthenticated, currentAgent, requiredPermission]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
