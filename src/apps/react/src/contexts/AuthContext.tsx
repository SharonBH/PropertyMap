// File: apps/react/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Agent, agents } from "@/lib/data";
import { settings } from "@/settings";

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

  // useEffect(() => {
  //   // Only redirect to login if not already on the login page
  //   if (isAuthenticated === false && window.location.pathname !== "/login") {
  //     window.location.href = "/login";
  //   }
  // }, [isAuthenticated]);

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

    if (settings.useMockLogin) {
      // Mock login logic
      console.log("Attempting mock login...");
      // You can use a predefined mock agent or the first one from your data
      const mockAgent = agents[0] || { id: "mock-user", name: "Mock User", email: "mock@example.com", phone: "", image: "/avatars/1.png", neighborhoods: [] };
      setCurrentAgent(mockAgent);
      localStorage.setItem("currentAgent", JSON.stringify(mockAgent));
      setIsAuthenticated(true);
      setIsLoading(false);
      console.log("Mock login successful for:", mockAgent.email);
      return true;
    }

    // Real API login logic
    try {
      const response = await fetch(`${settings.baseAPI}/api/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "tenant": "root",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log("Login response:", response);
      if (!response.ok) {
        setIsAuthenticated(false);
        return false;
      }

      const data = await response.json();
      if (data && data.token && data.refreshToken && data.refreshTokenExpiryTime) {
        setIsAuthenticated(true);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("refreshTokenExpiryTime", data.refreshTokenExpiryTime);
        
        // Fetch user profile to set currentAgent
        // This part assumes your /api/users/profile returns an Agent-like object
        // or you might need to adapt it or use a default/mock agent structure
        const userProfile = await fetchUserProfile();
        if (userProfile) {
          // Assuming userProfile structure matches Agent or can be mapped
          // You might need to adjust this mapping based on your API response
          const agentFromProfile: Agent = {
            id: userProfile.id || email, // Adjust as per your API response
            name: userProfile.name || email, // Adjust as per your API response
            email: userProfile.email || email,
            phone: userProfile.phone || "",
            image: userProfile.image || "", // Default image if not provided
            neighborhoods: userProfile.neighborhoods || [],
          };
          setCurrentAgent(agentFromProfile);
          localStorage.setItem("currentAgent", JSON.stringify(agentFromProfile));
        } else {
          // Fallback if profile fetch fails or doesn't provide enough info
          // This is a simple fallback, you might want a more robust solution
          const fallbackAgent: Agent = { id: email, name: email, email: email, phone: "", image: "", neighborhoods: [] };
          setCurrentAgent(fallbackAgent);
          localStorage.setItem("currentAgent", JSON.stringify(fallbackAgent));
          console.warn("Could not fetch user profile, using fallback agent data.");
        }
        return true;
      }
      // If tokens are not in data
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

  return (
    <AuthContext.Provider value={{ currentAgent, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
