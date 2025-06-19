import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AgencyResponse, searchAgenciesEndpoint } from "@/api/homemapapi";
import { Loader2, Building, AlertTriangle, RefreshCw } from "lucide-react";

interface TenantSelectorProps {
  onTenantSelect: (tenantId: string, agency: AgencyResponse) => void;
  onSkip?: () => void;
  isLoading?: boolean;
}

const TenantSelector: React.FC<TenantSelectorProps> = ({ 
  onTenantSelect, 
  onSkip, 
  isLoading = false 
}) => {
  const [agencies, setAgencies] = useState<AgencyResponse[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<AgencyResponse | null>(null);
  const [selectedFallbackId, setSelectedFallbackId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const [retryCount, setRetryCount] = useState(0);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualTenantId, setManualTenantId] = useState("");
  const [manualAgencyName, setManualAgencyName] = useState("");  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [defaultTab, setDefaultTab] = useState(() => {
    // If there's no stored tenant, start with fallback to avoid API calls
    const storedTenant = localStorage.getItem("currentTenant");
    return storedTenant ? "select" : "fallback";
  });
  
  const MAX_RETRY_COUNT = 2;

  // Common tenant options as fallback when API is not available
  const fallbackTenantOptions = [
    { id: "root", name: "Default (Root)" },
    { id: "agency1", name: "Agency 1" },
    { id: "agency2", name: "Agency 2" },
    { id: "demo", name: "Demo Agency" },
    { id: "test", name: "Test Agency" },
  ];
  const fetchAgencies = useCallback(async () => {
    // If API is already marked as unavailable, don't try again
    if (apiUnavailable) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch agencies from the API
      const response = await searchAgenciesEndpoint({
        pageNumber: 1,
        pageSize: 50, // Get up to 50 agencies
      });
      
      if (response && response.items) {
        setAgencies(response.items);
        setRetryCount(0); // Reset retry count on success
        setApiUnavailable(false);
      } else {
        setAgencies([]);
      }
    } catch (err: unknown) {
      console.error("Error fetching agencies:", err);
      
      // Handle different types of errors
      const errorResponse = err as { response?: { status?: number }; code?: string };
      const isAuthError = errorResponse?.response?.status === 401 || errorResponse?.response?.status === 403;
      const isNetworkError = errorResponse?.code === 'NETWORK_ERROR' || !errorResponse?.response;
      
      if (isAuthError) {
        // Mark API as unavailable and switch to fallback mode
        setApiUnavailable(true);
        setDefaultTab("fallback");
        setError("גישה לסוכנויות דורשת הרשאה. משתמש במצב ללא חיבור.");
        setShowManualInput(true);
      } else if (isNetworkError && retryCount < MAX_RETRY_COUNT) {
        // Retry network errors up to MAX_RETRY_COUNT times
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchAgencies(), 1000 * (retryCount + 1)); // Exponential backoff
        return; // Don't set loading to false yet
      } else {
        // Other errors - switch to fallback
        setApiUnavailable(true);
        setDefaultTab("fallback");
        setError("שגיאה בטעינת הסוכנויות. משתמש במצב ללא חיבור.");
        setShowManualInput(true);
      }
      
      setAgencies([]);
    } finally {
      setLoading(false);
    }
  }, [retryCount, apiUnavailable]);  useEffect(() => {
    // Only try to fetch agencies if API is not marked as unavailable 
    // and we're not starting in fallback mode
    if (!apiUnavailable && defaultTab === "select") {
      fetchAgencies();
    } else if (defaultTab === "fallback") {
      // If starting with fallback, mark as done loading
      setLoading(false);
    }
  }, [fetchAgencies, apiUnavailable, defaultTab]);
  const handleConfirm = () => {
    if (selectedAgency) {
      onTenantSelect(selectedAgency.id, selectedAgency);
    }
  };

  const handleManualConfirm = () => {
    if (manualTenantId.trim()) {
      const manualAgency: AgencyResponse = {
        id: manualTenantId.trim(),
        name: manualAgencyName.trim() || `Tenant ${manualTenantId.trim()}`,
        description: "Manually entered tenant",
        email: "",
        telephone: "",
        address: ""
      };
      onTenantSelect(manualTenantId.trim(), manualAgency);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };
  const handleRetry = () => {
    setRetryCount(0);
    setShowManualInput(false);
    setApiUnavailable(false);
    setDefaultTab("select");
    fetchAgencies();
  };
  const handleFallbackConfirm = () => {
    if (selectedFallbackId) {
      const fallbackOption = fallbackTenantOptions.find(option => option.id === selectedFallbackId);
      if (fallbackOption) {
        const fallbackAgency: AgencyResponse = {
          id: fallbackOption.id,
          name: fallbackOption.name,
          description: "Fallback tenant option",
          email: "",
          telephone: "",
          address: ""
        };
        onTenantSelect(fallbackOption.id, fallbackAgency);
      }
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin ml-2" />
          <span>טוען סוכנויות...</span>
          {retryCount > 0 && (
            <span className="text-sm text-muted-foreground ml-2">
              (ניסיון {retryCount + 1}/{MAX_RETRY_COUNT + 1})
            </span>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Building className="h-5 w-5" />
          בחר סוכנות
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          בחר את הסוכנות שלך כדי להמשיך
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select" disabled={apiUnavailable || (agencies.length === 0 && !loading)}>
              מהרשימה
            </TabsTrigger>
            <TabsTrigger value="fallback">נפוצים</TabsTrigger>
            <TabsTrigger value="manual">הזנה ידנית</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="space-y-4">
            {agencies.length > 0 ? (
              <>
                <Select
                  value={selectedAgency?.id || ""}
                  onValueChange={(value) => {
                    const agency = agencies.find(a => a.id === value);
                    setSelectedAgency(agency || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוכנות..." />
                  </SelectTrigger>
                  <SelectContent>
                    {agencies.map((agency) => (
                      <SelectItem key={agency.id} value={agency.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{agency.name}</span>
                          {agency.email && (
                            <span className="text-xs text-muted-foreground">{agency.email}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleConfirm} 
                  disabled={!selectedAgency || isLoading}
                  className="w-full"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                  אישור
                </Button>
              </>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  לא נמצאו סוכנויות במערכת
                </p>
                <Button onClick={handleRetry} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 ml-2" />
                  נסה שוב
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenantId">מזהה סוכנות (נדרש)</Label>
              <Input
                id="tenantId"
                placeholder="הזן מזהה סוכנות..."
                value={manualTenantId}
                onChange={(e) => setManualTenantId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="agencyName">שם סוכנות (אופציונלי)</Label>
              <Input
                id="agencyName"
                placeholder="הזן שם סוכנות..."
                value={manualAgencyName}
                onChange={(e) => setManualAgencyName(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleManualConfirm} 
              disabled={!manualTenantId.trim() || isLoading}
              className="w-full"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              אישור
            </Button>
          </TabsContent>          <TabsContent value="fallback" className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {apiUnavailable ? 
                "API לא זמין כרגע. אנא בחר סוכנות מתוך האפשרויות הבאות:" :
                "בחר סוכנות מתוך האפשרויות הנפוצות:"
              }
            </p>

            <Select
              value={selectedFallbackId}
              onValueChange={setSelectedFallbackId}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר סוכנות..." />
              </SelectTrigger>
              <SelectContent>
                {fallbackTenantOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>            <Button 
              onClick={handleFallbackConfirm} 
              disabled={!selectedFallbackId || isLoading}
              className="w-full"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              אישור
            </Button>

            {apiUnavailable && (
              <div className="pt-2 border-t">
                <Button onClick={handleRetry} variant="outline" size="sm" className="w-full">
                  <RefreshCw className="h-4 w-4 ml-2" />
                  נסה לחבר לשרת שוב
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {onSkip && (
          <div className="pt-2 border-t">
            <Button onClick={handleSkip} variant="outline" className="w-full">
              דלג - השתמש בהגדרות ברירת מחדל
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TenantSelector;
