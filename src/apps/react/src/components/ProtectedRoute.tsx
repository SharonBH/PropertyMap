import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = "/login" 
}) => {
  const { isAuthenticated, currentAgent } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isAuthenticated === undefined) {
    return <LoadingState />;
  }
  
  // Handle authentication failure
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // If we reach here, the user is authenticated
  return <>{children}</>;
};

const LoadingState: React.FC = () => {
  return (
    <div className="container max-w-md mx-auto p-6 mt-10">
      <Alert variant="default" className="mb-4">
        <AlertCircle className="h-4 w-4 ml-2" />
        <span>מאמת הרשאות...</span>
      </Alert>
      
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    </div>
  );
};

export default ProtectedRoute;
