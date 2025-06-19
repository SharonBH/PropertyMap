// File: apps/react/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Agent } from "@/lib/data";
import { settings } from "@/settings";
import { tokenGenerationEndpoint, getMeEndpoint, searchAgenciesEndpoint, searchNeighborhoodsEndpoint, NeighborhoodResponse } from "../api/homemapapi";

interface AuthContextType {
  currentAgent: Agent | null;
  isAuthenticated: boolean | undefined;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    // Only redirect to login if:
    // 1. Authentication check is complete (not undefined)
    // 2. User is not authenticated
    // 3. Not already on the login page
    // 4. Not on a public page
    const publicPaths = ['/login', '/properties', '/property/', '/neighborhood', '/about', '/services', '/contact'];
    const isPublicPath = publicPaths.some(path => 
      path.endsWith('/') ? window.location.pathname.startsWith(path) : window.location.pathname === path
    );
    
    if (isAuthenticated === false && !isPublicPath) {
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  }, [isAuthenticated]);

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


  const login = async (email: string, password: string): Promise<boolean> => {
  setIsLoading(true);

  try {
    // Call the token generation endpoint
const tokenRes = await tokenGenerationEndpoint(
      { email, password },
      {
        headers: {
          "tenant": "root", // or use a dynamic value if needed
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
          "tenant": "root",
        },
      });
      if (userProfileRes) {        // Fetch agency (first result) and all neighborhoods for the agent
  let agency = null;
  let neighborhoods: NeighborhoodResponse[] = [];

  // Search for agencies (assuming you can filter by agent email or id)
  const agenciesRes = await searchAgenciesEndpoint({
    pageNumber: 1,
    pageSize: 1,
  });
  if (agenciesRes && agenciesRes.items && agenciesRes.items.length > 0) {
    agency = agenciesRes.items[0];
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
      }
      return true;
    }
    setIsAuthenticated(false);
    return false;
  } catch (error) {
    console.error("Login error:", error);
    setIsAuthenticated(false);
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
    if (settings.useMockLogin) {
      console.log("Mock user logged out.");
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

  return (
    <AuthContext.Provider value={{ currentAgent, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
