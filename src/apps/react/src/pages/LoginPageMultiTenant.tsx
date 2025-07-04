import React, { useState } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { useTenant } from "@/contexts/TenantContext";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, Loader2, Building } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AgencyResponse } from "@/api/homemapapi";

// Updated login schema that includes tenantId
const loginSchema = z.object({
  email: z.string().email({ message: "יש להזין כתובת אימייל תקינה" }),
  password: z.string().min(1, { message: "יש להזין סיסמה" }),
  tenantId: z.string().min(1, { message: "יש לבחור סוכנות" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { setTenant } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [agencies, setAgencies] = useState<AgencyResponse[]>([]);
  const [loadingAgencies, setLoadingAgencies] = useState(true);
  
  // Common tenant options as fallback when API is not available
  const fallbackTenantOptions = [
    { id: "root", name: "Default (Root)" },
    { id: "agency1", name: "Agency 1" },
    { id: "agency2", name: "Agency 2" },
    { id: "demo", name: "Demo Agency" },
    { id: "test", name: "Test Agency" },
  ];

  // Check if multi-tenancy is enabled
  const isMultiTenantEnabled = import.meta.env.VITE_MULTI_TENANT === "true" || true; // Default to true

  // Get the redirect path from URL search params, location state, or default to home
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || location.state?.from || "/";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      tenantId: "root", // Default to root tenant
    },
  });

  // Fetch agencies when component mounts
  React.useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoadingAgencies(true);
        const response = await searchAgenciesEndpoint({
          pageNumber: 1,
          pageSize: 50, // Get up to 50 agencies
        });
        
        if (response && response.items) {
          setAgencies(response.items);
        } else {
          setAgencies([]);
        }
      } catch (error) {
        console.error("Error fetching agencies:", error);
        // Fallback to built-in options
        setAgencies([]);
      } finally {
        setLoadingAgencies(false);
      }
    };

    if (isMultiTenantEnabled) {
      fetchAgencies();
    }
  }, [isMultiTenantEnabled]);

  const performLogin = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      const success = await login(data.email, data.password, data.tenantId);
      
      if (success) {
        // Find the selected agency from our list
        let selectedAgency: AgencyResponse | undefined;
        
        // Look in fetched agencies first
        selectedAgency = agencies.find(agency => agency.id === data.tenantId);
        
        // If not found, check in fallback list
        if (!selectedAgency) {
          const fallbackOption = fallbackTenantOptions.find(option => option.id === data.tenantId);
          if (fallbackOption) {
            selectedAgency = {
              id: fallbackOption.id,
              name: fallbackOption.name,
              description: "Fallback tenant option",
              email: "",
              telephone: "",
              address: ""
            };
          }
        }
        
        // Set tenant context if agency was found
        if (selectedAgency) {
          setTenant(selectedAgency.id, selectedAgency);
        }
          toast({
          title: "התחברת בהצלחה",
          description: `ברוך הבא למערכת ניהול הנדל״ן${selectedAgency ? ` - ${selectedAgency.name}` : ''}`,
        });
        navigate(redirectPath, { replace: true });
      } else {
        setLoginError("שם המשתמש או הסיסמה שגויים");
        toast({
          title: "התחברות נכשלה",
          description: "שם המשתמש או הסיסמה שגויים",
          variant: "destructive",
        });
      }
    } catch (error) {
      setLoginError("אירעה שגיאה במהלך ההתחברות");
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה במהלך ההתחברות",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    await performLogin(data);
  };

  // If already authenticated, redirect to manage page
  if (isAuthenticated === true) {
    return <Navigate to="/" replace />;
  }

  // Show login form with integrated tenant selection
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
      <div className="container flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-estate-blue mb-2">התחברות</h1>
            <p className="text-muted-foreground">
              הזינו את פרטי ההתחברות שלכם
            </p>
          </div>

          {loginError && (
            <Alert variant="destructive">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {isMultiTenantEnabled && (
                <FormField
                  control={form.control}
                  name="tenantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        סוכנות
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting || loadingAgencies}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר סוכנות..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingAgencies ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin ml-2" />
                              טוען...
                            </div>
                          ) : agencies.length > 0 ? (
                            agencies.map((agency) => (
                              <SelectItem key={agency.id} value={agency.id}>
                                {agency.name}
                              </SelectItem>
                            ))
                          ) : (
                            // Fallback options if no agencies are fetched
                            fallbackTenantOptions.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>כתובת אימייל</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="הזן כתובת אימייל"
                        disabled={isSubmitting}
                        className="text-right"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>סיסמה</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="הזן סיסמה"
                        disabled={isSubmitting}
                        className="text-right"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      מתחבר...
                    </>
                  ) : (
                    <>
                      התחבר
                      <LogIn className="mr-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              אין לך חשבון? צור קשר עם מנהל המערכת
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
