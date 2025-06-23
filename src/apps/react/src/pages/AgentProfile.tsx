import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserDetail, UpdateUserCommand, updateUserEndpoint } from "@/api/homemapapi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Loader2, User } from "lucide-react";
import AgencySection from "@/components/profile/AgencySection";
import Navbar from "@/components/Navbar";
import AgentFooter from "@/components/properties/AgentFooter";

// Define form validation schema
const profileSchema = z.object({
  firstName: z.string().min(2, { message: "שם פרטי חייב להכיל לפחות 2 תווים" }),
  lastName: z.string().min(2, { message: "שם משפחה חייב להכיל לפחות 2 תווים" }),
  email: z.string().email({ message: "אנא הזן כתובת אימייל תקינה" }),
  phoneNumber: z.string().optional(),
  // We'll handle image upload separately
});

type ProfileFormData = z.infer<typeof profileSchema>;

const AgentProfile = () => {
  const { currentAgent, refreshCurrentAgent } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentAgent?.name?.split(" ")[0] || "",
      lastName: currentAgent?.name?.split(" ")[1] || "",
      email: currentAgent?.email || "",
      phoneNumber: currentAgent?.phone || "",
    },
  });

  // Update form values when currentAgent changes
  useEffect(() => {
    if (currentAgent) {
      const nameParts = currentAgent.name.split(" ");
      form.reset({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: currentAgent.email,
        phoneNumber: currentAgent.phone || "",
      });
      
      // Set profile image if available
      if (currentAgent.image) {
        setPreviewUrl(currentAgent.image);
      }
    }
  }, [currentAgent, form]);

  // Handle file selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };
  // Form submission handler
  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData: UpdateUserCommand = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || null,
        email: data.email,
        deleteCurrentImage: previewUrl === null && currentAgent?.image ? true : false
      };

      // If a new image was selected, add it to the update command
      if (selectedImage) {
        updateData.image = {
          name: selectedImage.name,
          extension: selectedImage.name.split('.').pop() || '',
          data: await fileToBase64(selectedImage)
        };
      }

      // Send update request
      await updateUserEndpoint(updateData);
        // Refresh agent info
      await refreshCurrentAgent();
      
      toast({
        title: "הפרופיל עודכן",
        description: "פרטי הפרופיל שלך עודכנו בהצלחה.",
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("עדכון הפרופיל נכשל. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let base64 = reader.result as string;
        // Remove the data:image/xxx;base64, part
        base64 = base64.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!currentAgent?.name) return "?";
    return currentAgent.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  if (!currentAgent) {
    // If not logged in, redirect to login
    navigate("/login");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">ניהול פרופיל סוכן</h1>
            <p className="text-muted-foreground">
              עדכן את הפרטים האישיים שלך ואת פרטי הסוכנות
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left column - Profile Image */}        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>תמונת פרופיל</CardTitle>
            <CardDescription>
              העלה תמונת פרופיל כדי להוסיף נגיעה אישית לפרופיל שלך
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <Avatar className="w-32 h-32 border-4 border-muted">
              {previewUrl ? (
                <AvatarImage src={previewUrl} alt="תמונת פרופיל" />
              ) : (
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="profile-image" className="cursor-pointer">
                <div className="bg-secondary w-full text-center py-2 rounded-md hover:bg-secondary/80 transition">
                  בחר תמונה
                </div>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {previewUrl && (
                <Button
                  variant="outline"                  type="button"
                  onClick={handleRemoveImage}
                >
                  הסר תמונה
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right column - Personal Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>מידע אישי</CardTitle>
            <CardDescription>
              עדכן את הפרטים האישיים שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (                      <FormItem>
                        <FormLabel>שם פרטי</FormLabel>
                        <FormControl>
                          <Input placeholder="ישראל" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>שם משפחה</FormLabel>
                        <FormControl>
                          <Input placeholder="ישראלי" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>דוא"ל</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="israel@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>מספר טלפון</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+972 00 000 0000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      מעדכן...
                    </>
                  ) : (
                    "שמור שינויים"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>        {/* Agency Information */}
        <AgencySection className="md:col-span-3" agency={currentAgent.agency} />
      </div>
        </div>      </main>
      <AgentFooter agent={currentAgent} />
    </div>
  );
};

export default AgentProfile;
