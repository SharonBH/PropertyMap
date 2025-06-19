import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, RefreshCw } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";
import { useAuth } from "@/contexts/useAuth";
import TenantInfo from "@/components/TenantInfo";

/**
 * Example component showing how to use multi-tenancy features
 * This demonstrates:
 * - Accessing current tenant information
 * - Displaying tenant-specific data
 * - Tenant switching functionality
 */
const MultiTenantExample: React.FC = () => {
  const { currentTenant, currentAgency, isMultiTenant } = useTenant();
  const { currentAgent } = useAuth();

  if (!isMultiTenant) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Multi-tenancy is not enabled for this application.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Multi-Tenant Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium">Multi-Tenant Enabled:</span>
              <Badge variant={isMultiTenant ? "default" : "secondary"} className="ml-2">
                {isMultiTenant ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <span className="text-sm font-medium">Current Tenant:</span>
              <Badge variant="outline" className="ml-2">
                {currentTenant || "None"}
              </Badge>
            </div>
          </div>
          
          {currentAgent && (
            <div>
              <span className="text-sm font-medium">Logged in as:</span>
              <span className="ml-2">{currentAgent.name}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {currentAgency && (
        <TenantInfo 
          agency={currentAgency} 
          currentTenant={currentTenant}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Usage in Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>To access tenant context:</strong></p>
            <code className="block bg-muted p-2 rounded text-xs">
              {`const { currentTenant, currentAgency } = useTenant();`}
            </code>
            
            <p><strong>To check if multi-tenancy is enabled:</strong></p>
            <code className="block bg-muted p-2 rounded text-xs">
              {`const { isMultiTenant } = useTenant();`}
            </code>
            
            <p><strong>API calls automatically include tenant header:</strong></p>
            <code className="block bg-muted p-2 rounded text-xs">
              {`headers: { tenant: "${currentTenant || 'root'}" }`}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiTenantExample;
