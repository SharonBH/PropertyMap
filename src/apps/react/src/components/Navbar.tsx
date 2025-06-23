import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Building, Phone, Info, Settings, Map, LogIn, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenantManagement } from "@/hooks/useTenantManagement";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentAgent, logout } = useAuth();
  const { agentNeighborhoods } = useProperties();
  const { currentAgency, canSwitchTenant, switchTenant } = useTenantManagement();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Check if the path starts with a certain prefix
  const isActivePrefix = (prefix: string) => {
    return location.pathname.startsWith(prefix);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-10">
      <div className="container flex justify-between items-center h-16 px-4">        
        <Link to="/" className="font-bold text-xl text-foreground">
              {currentAgency.name}
        </Link>
        
        <div className="flex gap-1 md:gap-2">
        {/*   <NavItem 
            to="/" 
            icon={<Home className="h-4 w-4" />} 
            label="בית"
            isActive={isActive("/")}
          /> 
            <NavItem 
            to="/" 
            icon={<Building className="h-4 w-4" />} 
            label="נכסים"
            isActive={isActive("/")}
          />
          
          <NavItem 
            to="/services" 
            icon={<Settings className="h-4 w-4" />} 
            label="שירותים"
            isActive={isActive("/services")}
          />
          
          <NavItem 
            to="/about" 
            icon={<Info className="h-4 w-4" />} 
            label="אודות"
            isActive={isActive("/about")}
          />
          
          <NavItem 
            to="/contact" 
            icon={<Phone className="h-4 w-4" />} 
            label="צור קשר"
            isActive={isActive("/contact")}
          />
          */}
          {isAuthenticated ? (
            <>
              <NavItem 
                to="/neighborhood" 
                icon={<Map className="h-4 w-4" />} 
                label="שכונות"
                isActive={isActivePrefix("/neighborhood")}
              />
              <NavItem 
                to="/" 
                icon={<User className="h-4 w-4" />} 
                label={currentAgent?.name || "סוכן"}
                isActive={isActive("/")}
              />              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="mr-2 text-sm"
              >
                התנתק
              </Button>
             {/*  {canSwitchTenant() && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={switchTenant}
                  className="mr-2 text-sm"
                >
                  החלף סוכנות
                </Button>
              )} */}
            </>
          ) : (
            <NavItem 
              to="/login" 
              icon={<LogIn className="h-4 w-4" />} 
              label="התחבר"
              isActive={isActive("/login")}
            />
          )}
          
         {/*  <div className="ml-2">
            <ThemeToggle />
          </div> */}
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
      isActive
        ? "bg-primary/10 text-primary font-medium"
        : "text-foreground hover:bg-muted"
    )}
  >
    <span className="ml-2">{icon}</span>
    <span className="hidden md:inline">{label}</span>
  </Link>
);

export default Navbar;
