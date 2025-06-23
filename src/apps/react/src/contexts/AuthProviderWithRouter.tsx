import { useNavigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { useTenant } from "./TenantContext";

interface AuthProviderWithRouterProps {
  children: React.ReactNode;
}

export const AuthProviderWithRouter = ({ children }: AuthProviderWithRouterProps) => {
  const navigate = useNavigate();
  const { clearTenant } = useTenant();
  
  return (
    <AuthProvider navigate={navigate} clearTenant={clearTenant}>
      {children}
    </AuthProvider>
  );
};
