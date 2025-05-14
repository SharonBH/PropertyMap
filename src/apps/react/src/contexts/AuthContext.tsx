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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Call .NET API for login
      const response = await fetch(`${settings.baseAPI}/api/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "tenant": "root", // Added static tenant header
        },
        body: JSON.stringify({ email, password }),
      });
console.log("Login response:", response);
      if (!response.ok) {
        setIsAuthenticated(false);
        return false;
      }

      const data = await response.json();
      // Expecting data to contain token and agent info
      if (data && data.token) {
        //setCurrentAgent(data.agent);
        setIsAuthenticated(true);
        localStorage.setItem("currentAgent", JSON.stringify(data.agent));
        localStorage.setItem("authToken", data.token);
        return true;
      }
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
  };

  return (
    <AuthContext.Provider value={{ currentAgent, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
