// File: apps/react/src/contexts/AuthContext.tsx
import React, { useState, useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import { Agent } from "@/lib/data";
import { settings } from "@/settings";
import { tokenGenerationEndpoint, getMeEndpoint, searchAgenciesEndpoint, searchNeighborhoodsEndpoint, NeighborhoodResponse } from "../api/homemapapi";
import { AuthContext, AuthContextType } from "./AuthContextTypes";

interface AuthProviderProps {
  children: React.ReactNode;
  navigate?: NavigateFunction;
  clearTenant?: () => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, navigate, clearTenant }) => {
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for stored authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const storedAgent = localStorage.getItem("currentAgent");
        if (storedAgent) {
          setCurrentAgent(JSON.parse(storedAgent));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);  
  
  // Redirect to login when authentication fails
  useEffect(() => {
    // Skip redirection when:
    // 1. Authentication check is not complete (undefined)
    // 2. User is authenticated
    // 3. User is already on a public path
    if (isAuthenticated !== false) return;
    
    const publicPaths = ['/login', '/properties', '/property/', '/about', '/services', '/contact'];
    const currentPath = window.location.pathname;
    const isPublicPath = publicPaths.some(path => 
      path.endsWith('/') ? currentPath.startsWith(path) : currentPath === path
    );
    
    if (!isPublicPath) {
      // Only redirect if we are not on a public path already
      if (navigate) {
        navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
      } else {
        // Fallback to direct navigation if navigate function is not available
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
  }, [isAuthenticated, navigate]);

  // Helper: Check if token is expired
  const isTokenExpired = () => {
    const expiry = localStorage.getItem("refreshTokenExpiryTime");
    if (!expiry) return true;
    return Date.now() > Number(expiry);
  };

  // Helper: Refresh token
  const refreshToken = async () => {
    const token = localStorage.getItem("refreshToken");
    if (!token) return false;
    try {
      const response = await fetch(`${settings.baseAPI}/api/token/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "tenant": "root",
        },
        body: JSON.stringify({ refreshToken: token }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      if (data && data.token && data.refreshToken && data.refreshTokenExpiryTime) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("refreshTokenExpiryTime", data.refreshTokenExpiryTime);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      setIsAuthenticated(false);
      return false;
    }
  };

  // Example: Fetch current user profile from API
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    try {
      const response = await fetch(`${settings.baseAPI}/api/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "tenant": "root",
        },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  // Optionally: useEffect to auto-refresh token before expiry
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isAuthenticated && isTokenExpired() && !settings.useMockLogin) { // Don't refresh token in mock mode
        await refreshToken();
      }
    }, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, [isAuthenticated]);
  
  const login = async (email: string, password: string, tenantId?: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Determine tenant - use provided tenantId or default to 'root'
      const selectedTenant = tenantId || 'root';
      
      // Store tenant BEFORE making the login request so it's included in headers
      localStorage.setItem("currentTenant", selectedTenant);
      
      // Call the token generation endpoint
      const tokenRes = await tokenGenerationEndpoint(
        { email, password },
        {
          headers: {
            "tenant": selectedTenant,
            "Content-Type": "application/json"
          }
        }
      );

      if (tokenRes && tokenRes.token && tokenRes.refreshToken && tokenRes.refreshTokenExpiryTime) {
        setIsAuthenticated(true);
        localStorage.setItem("authToken", tokenRes.token);
        localStorage.setItem("refreshToken", tokenRes.refreshToken);
        localStorage.setItem("refreshTokenExpiryTime", tokenRes.refreshTokenExpiryTime);

        // Fetch user profile using the new token
        const userProfileRes = await getMeEndpoint({
          headers: {
            "Authorization": `Bearer ${tokenRes.token}`,
            "Content-Type": "application/json",
            "tenant": selectedTenant,
          },
        });
        if (userProfileRes) {
          // Fetch agency (first result) and all neighborhoods for the agent
          let agency = null;
          let neighborhoods: NeighborhoodResponse[] = [];
          // Search for agencies (assuming you can filter by agent email or id)
          const agenciesRes = await searchAgenciesEndpoint({
            pageNumber: 1,
            pageSize: 1,
          });
          if (agenciesRes && agenciesRes.items && agenciesRes.items.length > 0) {
            agency = agenciesRes.items[0];
            // Tenant was already set earlier in the login process
          } else {
            // Keep the selected tenant if no agency found
            // Tenant was already set earlier in the login process
          }

          const neighborhoodsRes = await searchNeighborhoodsEndpoint({
            pageNumber: 1,
            pageSize: 10, // or whatever is appropriate
          });
          if (neighborhoodsRes && neighborhoodsRes.items) {
            neighborhoods = neighborhoodsRes.items;
          }

          // Map userProfile to Agent type
          const agentFromProfile: Agent = {
            id: userProfileRes.id || email,
            name: userProfileRes.firstName && userProfileRes.lastName
              ? `${userProfileRes.firstName} ${userProfileRes.lastName}`
              : userProfileRes.userName || email,
            email: userProfileRes.email || email,
            phone: userProfileRes.phoneNumber || "",
            image: userProfileRes.imageUrl || "",
            agency: agency,
            neighborhoods: neighborhoods,
          };
          setCurrentAgent(agentFromProfile);
          localStorage.setItem("currentAgent", JSON.stringify(agentFromProfile));
        } else {
          // Fallback if profile fetch fails
          const fallbackAgent: Agent = { 
            id: email, 
            name: email, 
            email: email, 
            phone: "", 
            image: "", 
            agency: { id: "NA", name: "Unknown Agency" }, // Provide minimal AgencyResponse
            neighborhoods: []
          };
          setCurrentAgent(fallbackAgent);
          localStorage.setItem("currentAgent", JSON.stringify(fallbackAgent));
          // Tenant was already set earlier in the login process
        }
        return true;
      }
      
      // For failed login (no token returned), DON'T update authentication state
      // This prevents triggering the redirect useEffect
      // Just return false to indicate failure
      return false;
    } catch (error) {
      console.error("Login error:", error);
      // Don't change authentication state on login errors
      // This prevents the useEffect redirect from triggering unnecessarily
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    setCurrentAgent(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentAgent");
    // Also remove API tokens on logout
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshTokenExpiryTime");
    // Clear tenant information
    localStorage.removeItem("currentTenant");

    // Clear agency information using the clearTenant function if available
    if (clearTenant) {
      clearTenant();
    } else {
      // Fallback - ensure agency info is also cleared from localStorage
      localStorage.removeItem("currentAgency");
    }

    if (settings.useMockLogin) {
      console.log("Mock user logged out.");
    }
    
    // Navigate to login page using React Router if available
    if (navigate) {
      navigate('/login');
    }
  };

  // Listen for session expiry events from the API interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      console.log('Session expired - forcing logout');
      // Clear local state
      setCurrentAgent(null);
      setIsAuthenticated(false);
      // Don't clear localStorage here - already done by interceptor
      
      // Show user-friendly notification
      // Note: We use setTimeout to ensure the toast system is available
      setTimeout(() => {
        // Try to show toast if available
        try {
          const event = new CustomEvent('auth:show-session-expired-toast');
          window.dispatchEvent(event);
        } catch (error) {
          console.warn('Could not show session expired notification:', error);
        }
      }, 500);
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, []);
  // Function to refresh agent data from API
  const refreshCurrentAgent = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      // Get current tenant ID
      const tenantId = localStorage.getItem("currentTenant");
      
      // Fetch updated user profile
      const userProfileRes = await getMeEndpoint({
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "tenant": tenantId || "",
        },
      });
      
      if (userProfileRes) {
        // Keep existing agency and neighborhoods data if available
        const existingAgency = currentAgent?.agency;
        const existingNeighborhoods = currentAgent?.neighborhoods || [];
        
        // Map userProfile to Agent type
        const agentFromProfile: Agent = {
          id: userProfileRes.id || currentAgent?.id || "",
          name: userProfileRes.firstName && userProfileRes.lastName
            ? `${userProfileRes.firstName} ${userProfileRes.lastName}`
            : userProfileRes.userName || currentAgent?.name || "",
          email: userProfileRes.email || currentAgent?.email || "",
          phone: userProfileRes.phoneNumber || currentAgent?.phone || "",
          image: userProfileRes.imageUrl || currentAgent?.image || "",
          agency: existingAgency,
          neighborhoods: existingNeighborhoods,
        };
        
        setCurrentAgent(agentFromProfile);
        localStorage.setItem("currentAgent", JSON.stringify(agentFromProfile));
      }
    } catch (error) {
      console.error("Error refreshing agent data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentAgent, isAuthenticated, isLoading, login, logout, refreshCurrentAgent }}>
      {children}
    </AuthContext.Provider>
  );
};
