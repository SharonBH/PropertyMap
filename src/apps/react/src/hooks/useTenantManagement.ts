import { useCallback } from "react";
import { useTenant } from "@/contexts/TenantContext";
import { useAuth } from "@/contexts/useAuth";
import { toast } from "@/hooks/use-toast";

/**
 * Custom hook for tenant management operations
 * Provides convenient methods for tenant-related actions
 */
export const useTenantManagement = () => {
  const { 
    currentTenant, 
    currentAgency, 
    setTenant, 
    clearTenant, 
    isMultiTenant 
  } = useTenant();
  const { logout } = useAuth();

  /**
   * Switch to a different tenant
   * This will trigger a re-login process
   */
  const switchTenant = useCallback(async () => {
    try {
      // Clear current session
      clearTenant();
      logout();
      
      toast({
        title: "מחליף סוכנות",
        description: "יש להתחבר מחדש כדי להחליף סוכנות",
      });
      
      // Redirect to login will happen automatically via AuthContext
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת החלפת הסוכנות",
        variant: "destructive",
      });
    }
  }, [clearTenant, logout]);

  /**
   * Get the current tenant identifier for API calls
   */
  const getCurrentTenantId = useCallback(() => {
    return currentTenant || 'root';
  }, [currentTenant]);

  /**
   * Check if user is in a specific tenant
   */
  const isInTenant = useCallback((tenantId: string) => {
    return currentTenant === tenantId;
  }, [currentTenant]);

  /**
   * Get tenant-specific information
   */
  const getTenantInfo = useCallback(() => {
    return {
      tenantId: currentTenant,
      agencyName: currentAgency?.name,
      agencyEmail: currentAgency?.email,
      agencyPhone: currentAgency?.telephone,
      agencyAddress: currentAgency?.address,
    };
  }, [currentTenant, currentAgency]);

  /**
   * Check if tenant switching is available
   */
  const canSwitchTenant = useCallback(() => {
    return isMultiTenant && currentTenant !== null;
  }, [isMultiTenant, currentTenant]);

  return {
    // State
    currentTenant,
    currentAgency,
    isMultiTenant,
    
    // Actions
    switchTenant,
    clearTenant,
    
    // Utilities
    getCurrentTenantId,
    isInTenant,
    getTenantInfo,
    canSwitchTenant,
  };
};
