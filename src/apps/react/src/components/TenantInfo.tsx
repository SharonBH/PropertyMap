import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, MapPin, Settings } from "lucide-react";
import { AgencyResponse } from "@/api/homemapapi";

interface TenantInfoProps {
  agency: AgencyResponse | null;
  currentTenant: string | null;
  onSwitchTenant?: () => void;
}

const TenantInfo: React.FC<TenantInfoProps> = ({ 
  agency, 
  currentTenant, 
  onSwitchTenant 
}) => {
  if (!agency || !currentTenant) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            <span>פרטי סוכנות</span>
          </div>
          {onSwitchTenant && (
            <Button variant="outline" size="sm" onClick={onSwitchTenant}>
              <Settings className="h-4 w-4 ml-1" />
              החלף סוכנות
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">שם הסוכנות:</span>
          <span className="text-sm">{agency.name}</span>
        </div>
        
        {agency.email && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">אימייל:</span>
            <span className="text-sm">{agency.email}</span>
          </div>
        )}
        
        {agency.telephone && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">טלפון:</span>
            <span className="text-sm">{agency.telephone}</span>
          </div>
        )}
        
        {agency.address && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">כתובת:</span>
            <span className="text-sm">{agency.address}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">מזהה tenant:</span>
          <Badge variant="secondary" className="text-xs">
            {currentTenant}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantInfo;
