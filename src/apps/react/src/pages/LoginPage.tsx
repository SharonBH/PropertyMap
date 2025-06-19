import React, { useState } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email({ message: "יש להזין כתובת אימייל תקינה" }),
  password: z.string().min(1, { message: "יש להזין סיסמה" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

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

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        toast({
          title: "התחברת בהצלחה",
          description: "ברוך הבא למערכת ניהול הנדל״ן",
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

  // If already authenticated, redirect to manage page
  if (isAuthenticated === true) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
      <div className="container flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-soft">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-estate-dark-gray">התחברות סוכן</h1>
            <p className="mt-2 text-gray-600">התחבר כדי לנהל את הנכסים שלך</p>
            
            {location.state?.from && (
              <Alert className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
                <AlertDescription>
                  יש להתחבר כדי לגשת ל-{location.state.from}
                </AlertDescription>
              </Alert>
            )}
            
            {loginError && (
              <Alert className="mt-4 bg-red-50 text-red-800 border-red-200">
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>אימייל</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        autoComplete="email"
                        disabled={isSubmitting}
                        {...field}
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
                        type="password"
                        placeholder="הזן את הסיסמה שלך"
                        autoComplete="current-password"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    מתחבר...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 ml-2" />
                    התחבר
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-sm text-center text-gray-600">
            <p>שכחת סיסמה? צור קשר עם מנהל המערכת</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
