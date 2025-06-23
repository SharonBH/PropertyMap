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
import { AgencyResponse } from "@/api/homemapapi";
import { Button } from "@/components/ui/button";
import { LogIn, Loader2, Building } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAgency } from "@/hooks/useAgency";

// Updated login schema that includes tenantId
const loginSchema = z.object({
  email: z.string().email({ message: "יש להזין כתובת אימייל תקינה" }),
  password: z.string().min(1, { message: "יש להזין סיסמה" }),
  tenantId: z.string().min(1, { message: "יש להזין מזהה סוכנות" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { setTenant } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchAgencyByTenant, createFallbackAgency } = useAgency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);  // Simple default tenant ID for the form

  // Check if multi-tenancy is enabled
  const isMultiTenantEnabled = import.meta.env.VITE_MULTI_TENANT === "true" || true; // Default to true
  // Get the redirect path from URL search params, location state, or default to neighborhood
  const searchParams = new URLSearchParams(location.search);
  // Use /neighborhood as the default redirect path instead of root
  const redirectPath = searchParams.get('redirect') || location.state?.from || "/neighborhood";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      tenantId: "root", // Default to root tenant
    },  });
  
  // No need to fetch agencies - we'll use a simple text input instead
  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      // preventDefault might be called in a form handler before this, but ensuring form event is handled properly
      const success = await login(data.email, data.password, data.tenantId);      if (success) {
        try {
          // Fetch agency details from the hook
          const agency = await fetchAgencyByTenant(data.tenantId);
          
          // Set tenant context with the agency info or fallback
          if (agency) {
            setTenant(data.tenantId, agency);
            console.log("Retrieved agency from API:", agency);
            
            toast({
              title: "התחברת בהצלחה",
              description: `ברוך הבא למערכת ניהול הנדל״ן - ${agency.name}`,
            });
          } else {
            // If no agency found, use fallback
            console.log("No agency found in API, using fallback");
            const fallbackAgency = createFallbackAgency(data.tenantId);
            setTenant(data.tenantId, fallbackAgency);
            
            toast({
              title: "התחברת בהצלחה",
              description: `ברוך הבא למערכת ניהול הנדל״ן - ${fallbackAgency.name}`,
            });
          }
        } catch (error) {
          console.error("Error fetching agency details:", error);
          
          // Fallback to simple agency object if API call fails
          const fallbackAgency = createFallbackAgency(data.tenantId);
          
          // Set tenant context with fallback agency
          setTenant(data.tenantId, fallbackAgency);
          
          toast({
            title: "התחברת בהצלחה",
            description: `ברוך הבא למערכת ניהול הנדל״ן - ${data.tenantId}`,
          });
        }
        
        // Always navigate to neighborhood page regardless of redirectPath
        navigate("/neighborhood", { replace: true });
        // The line below is commented out to ensure we always go to neighborhood:
        // navigate(redirectPath, { replace: true });
      } else {
        // Login failed but don't redirect or reload
        setLoginError("שם המשתמש או הסיסמה שגויים");
        toast({
          title: "התחברות נכשלה",
          description: "שם המשתמש או הסיסמה שגויים",
          variant: "destructive",
        });
        
        // Clear the password field to allow the user to try again
        form.setValue('password', '');
      }
    } catch (error) {
      console.error("Login error details:", error);
      setLoginError("אירעה שגיאה במהלך ההתחברות");
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה במהלך ההתחברות",
        variant: "destructive",
      });
      
      // Clear the password field to allow the user to try again
      form.setValue('password', '');
    } finally {
      setIsSubmitting(false);
    }
  };
  // If already authenticated, redirect to neighborhood page
  if (isAuthenticated === true) {
    return <Navigate to="/neighborhood" replace />;
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">              {isMultiTenantEnabled && (
                <FormField
                  control={form.control}
                  name="tenantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        מזהה סוכנות
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="הזן את מזהה הסוכנות"
                          disabled={isSubmitting}
                          className="text-right"
                        />
                      </FormControl>
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
