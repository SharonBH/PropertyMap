import React, { useRef } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';
import { NeighborhoodResponse, PropertyTypeResponse, PropertyStatusResponse, fileUpload } from '@/api/homemapapi';
import { z } from "zod";
import { resolveImageUrl } from "@/lib/imageUrl";

// Move schema and type to a separate file if needed to avoid Fast Refresh error
export type PropertyImageForm = { url: string; isMain: boolean };
export interface PropertyFormSchema {
  title: string;
  description: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  address: string;
  neighborhoodId: string;
  propertyTypeId: string;
  featureList?: string;
  markerPosition: { yaw: number; pitch: number };
  propertyStatusId: string;
  images: PropertyImageForm[];
}

interface FileUploadResponse {
  url: string;
}

interface PropertyFormFieldsProps {
  form: UseFormReturn<PropertyFormSchema>;
  neighborhoods: NeighborhoodResponse[];
  onNeighborhoodChange: (value: string) => void;
  propertyTypes: PropertyTypeResponse[];
  loadingTypes?: boolean;
  propertyStatuses: PropertyStatusResponse[];
  loadingStatuses?: boolean;
}

const PropertyFormFields = ({
  form,
  neighborhoods,
  onNeighborhoodChange,
  propertyTypes,
  loadingTypes,
  propertyStatuses,
  loadingStatuses,
}: PropertyFormFieldsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const images = form.watch("images");
  const [imageUploadError, setImageUploadError] = React.useState<string>("");

  // Upload image to API and return the URL
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      // fileUpload now returns unknown, so cast to expected type
      const response = await fileUpload("1", { data: formData }) as unknown as { url?: string };
      if (response && typeof response.url === "string" && response.url.length > 0) {
        return response.url;
      } else {
        setImageUploadError("העלאת התמונה נכשלה: כתובת לא חוקית מהשרת");
        return null;
      }
    } catch (err) {
      setImageUploadError("העלאת התמונה נכשלה. נסה שוב.");
      return null;
    }
  };

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUploadError("");
    const files = e.target.files;
    if (!files) return;
    const newImages: PropertyImageForm[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = await uploadImage(file);
      if (url) {
        newImages.push({ url, isMain: false });
      }
    }
    if (newImages.length === 0) {
      setImageUploadError("לא ניתן להעלות את התמונות. ודא שהקבצים תקינים ונסה שוב.");
    }
    // Use latest images from form state
    const currentImages = form.getValues("images") || [];
    form.setValue("images", [...currentImages, ...newImages], { shouldValidate: true, shouldDirty: true });
  };

  // Set main image
  const setMainImage = (idx: number) => {
    const currentImages = form.getValues("images") || [];
    form.setValue(
      "images",
      currentImages.map((img, i) => ({ ...img, isMain: i === idx })),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  // Remove image
  const removeImage = (idx: number) => {
    const currentImages = form.getValues("images") || [];
    const updated = currentImages.filter((_, i) => i !== idx);
    // If main image was removed, set first as main if any left
    if (!updated.some(img => img.isMain) && updated.length > 0) {
      updated[0].isMain = true;
    }
    form.setValue("images", updated, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>כותרת</FormLabel>
            <FormControl>
              <Input placeholder="הזן כותרת לנכס" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>תיאור</FormLabel>
            <FormControl>
              <Textarea placeholder="הזן תיאור לנכס" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מחיר (₪)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="מחיר" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>גודל (מ"ר)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="גודל" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>חדרי שינה</FormLabel>
              <FormControl>
                <Input type="number" placeholder="חדרי שינה" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>חדרי רחצה</FormLabel>
              <FormControl>
                <Input type="number" placeholder="חדרי רחצה" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>כתובת</FormLabel>
            <FormControl>
              <Input placeholder="הזן כתובת נכס" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="neighborhoodId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>שכונה</FormLabel>            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onNeighborhoodChange(value);
              }} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="בחר שכונה" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {neighborhoods.map((neighborhood) => (
                  <SelectItem key={neighborhood.id} value={neighborhood.id}>
                    {neighborhood.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="propertyTypeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>סוג נכס</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={loadingTypes}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={loadingTypes ? "טוען סוגי נכסים..." : "בחר סוג נכס"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="propertyStatusId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>סטטוס נכס</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={loadingStatuses}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={loadingStatuses ? "טוען סטטוסים..." : "בחר סטטוס נכס"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {propertyStatuses.map((status) => (
                  <SelectItem key={String(status.id)} value={String(status.id)}>{status.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="featureList"
        render={({ field }) => (
          <FormItem>
            <FormLabel>תכונות (מופרדות בפסיק)</FormLabel>
            <FormControl>
              <Input placeholder="הזן תכונות מופרדות בפסיק" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Property Images Upload */}
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>תמונות נכס</FormLabel>
            <FormControl>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  title="בחר תמונות להעלאה"
                  placeholder="בחר תמונות להעלאה"
                />
                <button
                  type="button"
                  className="mb-2 px-3 py-1 bg-primary text-white rounded"
                  onClick={() => fileInputRef.current?.click()}
                >
                  העלה תמונות
                </button>
                {imageUploadError && (
                  <div className="text-red-500 text-xs mb-2">{imageUploadError}</div>
                )}
                {form.formState.errors.images && (
                  <div className="text-red-500 text-xs mb-2">
                    {form.formState.errors.images.message || "יש להעלות לפחות תמונה אחת"}
                  </div>
                )}
                {Array.isArray(field.value) && field.value.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-4">
                    {field.value.map((img: PropertyImageForm, idx: number) => (
                      <li key={idx} className="flex flex-col items-center gap-1 border rounded p-2 relative">
                        <img
                          src={resolveImageUrl(img.url)}
                          alt="property"
                          className="w-24 h-24 object-cover rounded"
                          onError={(e) => {
                            // Prevent infinite loop: only set to broken-image if not already
                            const target = e.target as HTMLImageElement;
                            if (!target.dataset.broken) {
                              target.src = '/broken-image.png';
                              target.dataset.broken = 'true';
                            }
                          }}
                        />
                        <div className="flex gap-2 mt-1">
                          <button
                            type="button"
                            className={`px-2 py-1 rounded text-xs ${img.isMain ? "bg-green-600 text-white" : "bg-gray-200"}`}
                            onClick={() => setMainImage(idx)}
                            disabled={img.isMain}
                          >
                            {img.isMain ? "תמונה ראשית" : "הפוך לראשית"}
                          </button>
                          <button
                            type="button"
                            className="px-2 py-1 rounded text-xs bg-red-500 text-white"
                            onClick={() => removeImage(idx)}
                          >
                            מחק
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FormControl>
            {/* Remove <FormMessage /> here to avoid duplicate/undefined error */}
          </FormItem>
        )}
      />
    </>
  );
};

export default PropertyFormFields;
