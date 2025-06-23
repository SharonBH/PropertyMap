import React, { useState, useRef, useEffect } from "react";
import { AgencyResponse, updateAgencyEndpoint, fileUpload } from "@/api/homemapapi";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building, Paintbrush, Upload, X } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTenant } from "@/contexts/TenantContext";
import "./AgencySection.css";

interface AgencySectionProps {
  agency: AgencyResponse;
  className?: string;
}

const AgencySection: React.FC<AgencySectionProps> = ({ agency, className }) => {
  const { setTenant } = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reference to color preview element
  const colorPreviewRef = useRef<HTMLDivElement>(null);const [formData, setFormData] = useState({
    name: agency?.name || "",
    email: agency?.email || "",
    telephone: agency?.telephone || "",
    address: agency?.address || "",
    description: agency?.description || "",
    logoURL: agency?.logoURL || "",
    primaryColor: agency?.primaryColor || "#3a5a40"
  });
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(agency?.logoURL || null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);  // Validate form data before submission
  const validateForm = () => {
    // Name is required and must be at least 2 characters
    if (!formData.name || formData.name.trim().length < 2) {
      setError("שם הסוכנות חייב להיות לפחות 2 תווים.");
      return false;
    }
    
    // Trim text fields
    setFormData(prev => ({
      ...prev,
      name: prev.name.trim(),
      email: prev.email.trim(),
      telephone: prev.telephone.trim(),
      address: prev.address.trim(),
      description: prev.description.trim()
    }));
    
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, primaryColor: color }));
    
    // Update CSS variable for the color preview
    if (colorPreviewRef.current) {
      colorPreviewRef.current.style.setProperty('--color-value', color);
    }
  };
  
  // Apply the color when component mounts or color changes
  useEffect(() => {
    if (colorPreviewRef.current) {
      colorPreviewRef.current.style.setProperty('--color-value', formData.primaryColor);
    }
  }, [formData.primaryColor]);
  
  // Handle logo file selection
  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedLogo(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload the logo
      await uploadLogo(file);
    }
  };
  
  // Upload logo to server
  const uploadLogo = async (file: File) => {
    try {
      setUploadingLogo(true);
      setError(null);
      
      const formData = new FormData();
      formData.append("file", file);
      
      // Upload the file
      const response = await fileUpload("1", { data: formData }) as unknown as { url?: string };
      
      if (response && typeof response.url === "string" && response.url.length > 0) {
        // Update form data with the new URL
        setFormData(prev => ({ ...prev, logoURL: response.url }));
        toast({
          title: "לוגו הועלה",
          description: "הלוגו הועלה בהצלחה",
        });
      } else {
        setError("העלאת הלוגו נכשלה: כתובת לא חוקית מהשרת");
      }
    } catch (err) {
      console.error("Error uploading logo:", err);
      setError("העלאת הלוגו נכשלה. אנא נסה שוב.");
    } finally {
      setUploadingLogo(false);
    }
  };
  
  // Remove logo
  const handleRemoveLogo = () => {
    setSelectedLogo(null);
    setLogoPreviewUrl(null);
    setFormData(prev => ({ ...prev, logoURL: "" }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate the form before submission
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }      if (!agency?.id) {
        throw new Error("מזהה סוכנות לא נמצא");
      }      // Prepare the request data with proper ID and null handling
      const requestData = {
        id: agency.id,
        name: formData.name,
        email: formData.email || null,
        telephone: formData.telephone || null,
        address: formData.address || null,
        description: formData.description || null,
        logoURL: formData.logoURL || null,
        primaryColor: formData.primaryColor || null
      };
      
      const updatedAgency = await updateAgencyEndpoint(
        agency.id,
        requestData,
        "1"
      );

      // Update the tenant context with the updated agency
      if (updatedAgency) {
        setTenant(agency.id, {
          ...agency,
          name: formData.name,
          email: formData.email,
          telephone: formData.telephone,
          address: formData.address,
          description: formData.description,
          logoURL: formData.logoURL,
          primaryColor: formData.primaryColor
        });
      }

      toast({
        title: "הסוכנות עודכנה",
        description: "פרטי הסוכנות עודכנו בהצלחה.",
      });    } catch (error) {
      console.error("Error updating agency:", error);
      setError("עדכון פרטי הסוכנות נכשל. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          פרטי הסוכנות
        </CardTitle>
        <CardDescription>
          עדכן את פרטי הסוכנות והמיתוג שלך
        </CardDescription>
      </CardHeader>
      
      {error && (
        <div className="px-6 mb-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">שם הסוכנות</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="שם הסוכנות שלך"
              />
            </div>
            
            <div>
              <Label htmlFor="email">דוא"ל הסוכנות</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="agency@example.com"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="telephone">מספר טלפון</Label>
              <Input
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="+972 00 000 0000"
              />
            </div>
            
            {/* Logo upload section */}
            <div>
              <Label htmlFor="logo-upload">לוגו הסוכנות</Label>
              <div className="mt-2">
                {logoPreviewUrl ? (
                  <div className="mb-2 relative">
                    <img 
                      src={logoPreviewUrl} 
                      alt="לוגו הסוכנות" 
                      className="h-20 object-contain border p-1 rounded-md" 
                    />
                    <Button 
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-6 w-6 -mt-2 -mr-2 rounded-full"
                      onClick={handleRemoveLogo}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : null}
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="flex gap-2"
                  >
                    {uploadingLogo ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        מעלה...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        העלה לוגו
                      </>
                    )}
                  </Button>                  <input 
                    ref={fileInputRef}
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    title="העלאת לוגו"
                  />
                </div>
              </div>
            </div>
          </div>
            <div>
            <Label htmlFor="address">כתובת</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="כתובת הסוכנות"
            />
          </div>
          
          <div>
            <Label htmlFor="description">תיאור</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="תאר את השירותים והתמחויות של הסוכנות שלך"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label>צבע מותג</Label>
            <div className="flex items-center gap-3">              <div
                ref={colorPreviewRef}
                className="w-10 h-10 rounded-md border color-preview"
                data-color={formData.primaryColor}
              />
                <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" type="button" className="flex gap-2">
                    <Paintbrush className="h-4 w-4" />
                    בחר צבע
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <HexColorPicker
                    color={formData.primaryColor}
                    onChange={handleColorChange}
                  />
                  <div className="p-3">
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full md:w-auto md:min-w-[200px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                מעדכן...
              </>
            ) : (
              "עדכן פרטי סוכנות"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AgencySection;
