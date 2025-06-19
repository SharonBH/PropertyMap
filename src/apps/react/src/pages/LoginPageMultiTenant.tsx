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
import { LogIn, Loader2, ArrowRight, Building } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TenantSelector from "@/components/TenantSelector";
import { AgencyResponse } from "@/api/homemapapi";

const loginSchema = z.object({
  email: z.string().email({ message: "יש להזין כתובת אימייל תקינה" }),
  password: z.string().min(1, { message: "יש להזין סיסמה" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { setTenant } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<{tenantId: string; agency: AgencyResponse} | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);

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
    },
  });

  const performLogin = async (email: string, password: string, tenantId: string) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      const success = await login(email, password, tenantId);
      
      if (success) {
        // Set the tenant context after successful login
        if (selectedTenant) {
          setTenant(selectedTenant.tenantId, selectedTenant.agency);
        }
        
        toast({
          title: "התחברת בהצלחה",
          description: `ברוך הבא למערכת ניהול הנדל״ן${selectedTenant ? ` - ${selectedTenant.agency.name}` : ''}`,
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
    const tenantId = selectedTenant?.tenantId || 'root';
    await performLogin(data.email, data.password, tenantId);
  };

  const handleTenantSelect = (tenantId: string, agency: AgencyResponse) => {
    setSelectedTenant({ tenantId, agency });
    setShowLoginForm(true);
  };

  const handleSkipTenantSelection = () => {
    setSelectedTenant({ 
      tenantId: 'root', 
      agency: { 
        id: 'root', 
        name: 'Default', 
        description: '',
        email: '',
        telephone: '',
        address: ''
      } as AgencyResponse 
    });
    setShowLoginForm(true);
  };

  const handleBackToTenantSelection = () => {
    setSelectedTenant(null);
    setShowLoginForm(false);
    setLoginError(null);
    form.reset();
  };

  // If already authenticated, redirect to manage page
  if (isAuthenticated === true) {
    return <Navigate to="/" replace />;
  }

  // Show tenant selector first if multi-tenant is enabled and no tenant is selected
  if (isMultiTenantEnabled && !showLoginForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
        <div className="container flex items-center justify-center min-h-screen py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-estate-blue mb-2">ברוכים הבאים</h1>
              <p className="text-muted-foreground">אנא בחרו את הסוכנות שלכם כדי להתחבר</p>
            </div>
            
            <TenantSelector
              onTenantSelect={handleTenantSelect}
              onSkip={handleSkipTenantSelection}
              isLoading={false}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show login form after tenant selection (or immediately if multi-tenant is disabled)
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
      <div className="container flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-estate-blue mb-2">התחברות</h1>
            {selectedTenant && selectedTenant.tenantId !== 'root' && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  מתחבר לסוכנות: <strong>{selectedTenant.agency.name}</strong>
                </span>
              </div>
            )}
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

                {isMultiTenantEnabled && selectedTenant && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToTenantSelection}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                    חזור לבחירת סוכנות
                  </Button>
                )}
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
