import React, { createContext, useContext, useState, useEffect } from "react";
import { AgencyResponse } from "@/api/homemapapi";

interface TenantContextType {
  currentTenant: string | null;
  currentAgency: AgencyResponse | null;
  setTenant: (tenantId: string, agency: AgencyResponse) => void;
  clearTenant: () => void;
  isMultiTenant: boolean;
}

export const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<string | null>(null);
  const [currentAgency, setCurrentAgency] = useState<AgencyResponse | null>(null);

  // Load tenant from localStorage on mount
  useEffect(() => {
    const storedTenant = localStorage.getItem("currentTenant");
    const storedAgency = localStorage.getItem("currentAgency");
    
    if (storedTenant && storedAgency) {
      try {
        setCurrentTenant(storedTenant);
        setCurrentAgency(JSON.parse(storedAgency));
      } catch (error) {
        console.error("Error loading tenant from localStorage:", error);
        clearTenant();
      }
    }
  }, []);

  const setTenant = (tenantId: string, agency: AgencyResponse) => {
    setCurrentTenant(tenantId);
    setCurrentAgency(agency);
    localStorage.setItem("currentTenant", tenantId);
    localStorage.setItem("currentAgency", JSON.stringify(agency));
  };

  const clearTenant = () => {
    setCurrentTenant(null);
    setCurrentAgency(null);
    localStorage.removeItem("currentTenant");
    localStorage.removeItem("currentAgency");  };

  // Check if multi-tenancy is enabled (could be from environment or settings)
  const isMultiTenant = import.meta.env.VITE_MULTI_TENANT === "true" || true; // Default to true

  return (
    <TenantContext.Provider 
      value={{ 
        currentTenant, 
        currentAgency, 
        setTenant, 
        clearTenant, 
        isMultiTenant 
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
