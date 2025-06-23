import { createContext } from "react";
import { Agent } from "@/lib/data";

export interface AuthContextType {
  currentAgent: Agent | null;
  isAuthenticated: boolean | undefined;
  isLoading: boolean;
  login: (email: string, password: string, tenantId?: string) => Promise<boolean>;
  logout: () => void;
  refreshCurrentAgent: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
