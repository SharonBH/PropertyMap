import React from "react";
import { z } from "zod";
import { Controller, useFormContext } from "react-hook-form";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";

const schema = z.object({
  title: z.string().min(2, "הכותרת חייבת להכיל לפחות 2 תווים"),
  description: z.string().min(10, "התיאור חייב להכיל לפחות 10 תווים"),
  price: z.string().regex(/^\d+$/, "יש להזין מספר חוקי"),
  bedrooms: z.string().regex(/^\d+$/, "יש להזין מספר חוקי"),
  bathrooms: z.string().regex(/^\d+$/, "יש להזין מספר חוקי"),
  size: z.string().regex(/^\d+$/, "יש להזין מספר חוקי"),
  address: z.string().min(5, "הכתובת חייבת להכיל לפחות 5 תווים"),
  status: z.enum(["active", "pending", "sold"], { errorMap: () => ({ message: "יש לבחור סטטוס" }) }),
  neighborhoodId: z.string().min(1, "יש לבחור שכונה"),
  propertyTypeId: z.string().min(1, "יש לבחור סוג נכס"),
  featureList: z.string().optional(),
  markerPosition: z.object({
    yaw: z.number(),
    pitch: z.number(),
  }),
});

type PropertyFormFieldsProps = {
  form: any;
  neighborhoods: any[];
  onNeighborhoodChange: (value: string) => void;
  propertyTypes: any[]; // Add propertyTypes prop
  loadingTypes?: boolean;
};

const PropertyFormFields = ({
  form,
  neighborhoods,
  onNeighborhoodChange,
  propertyTypes,
  loadingTypes,
}: PropertyFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">כותרת</Label>
        <Input id="title" {...form.register("title")} />
        {form.formState.errors.title && (
          <span className="text-red-500 text-xs">
            {form.formState.errors.title.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="description">תיאור</Label>
        <Textarea id="description" {...form.register("description")} />
        {form.formState.errors.description && (
          <span className="text-red-500 text-xs">
            {form.formState.errors.description.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="price">מחיר</Label>
        <Input id="price" {...form.register("price")} />
        {form.formState.errors.price && (
          <span className="text-red-500 text-xs">
            {form.formState.errors.price.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="bedrooms">מספר חדרי שינה</Label>
        <Input id="bedrooms" {...form.register("bedrooms")} />
        {form.formState.errors.bedrooms && (
          <span className="text-red-500 text-xs">
            {form.formState.errors.bedrooms.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="bathrooms">מספר חדרי אמבטיה</Label>
        <Input id="bathrooms" {...form.register("bathrooms")} />
        {form.formState.errors.bathrooms && (
          <span className="text-red-500 text-xs">
            {form.formState.errors.bathrooms.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="size">גודל (מ"ר)</Label>
        <Input id="size" {...form.register("size")} />
        {form.formState.errors.size && (
          <span className="text-red-500 text-xs">
            {form.formState.errors.size.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="address">כתובת</Label>
        <Input id="address" {...form.register("address")} />
        {form.formState.errors.address && (
          <span className="text-red-500 text-xs">
            {form.formState.errors.address.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="status">סטטוס</Label>
        <select
          id="status"
          {...form.register("status")}
          className="input"
        >
          <option value="">בחר סטטוס</option>
          <option value="active">פעיל</option>
          <option value="pending">ממתין</option>
          <option value="sold">נמכר</option>
        </select>
        {form.formState.errors.status && (
          <span className="text-red-500 text-xs">
            {form.formState.errors.status.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="neighborhoodId">שכונה</Label>
        <select
          id="neighborhoodId"
          {...form.register("neighborhoodId")}
          className="input"
          onChange={(e) => onNeighborhoodChange(e.target.value)}
        >
          <option value="">בחר שכונה</option>
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood.id} value={neighborhood.id}>
              {neighborhood.name}
            </option>
          ))}
        </select>
        {form.formState.errors.neighborhoodId && (
          <span className="text-red-500 text-xs">
            {form.formState.errors.neighborhoodId.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="propertyTypeId">סוג נכס</Label>
        <select
          id="propertyTypeId"
          {...form.register("propertyTypeId")}
          className="input"
        >
          <option value="">בחר סוג נכס</option>
          {loadingTypes ? (
            <option disabled>טוען...</option>
          ) : (
            propertyTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))
          )}
        </select>
        {form.formState.errors.propertyTypeId && (
          <span className="text-red-500 text-xs">
            {form.formState.errors.propertyTypeId.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="featureList">תכונות נוספות</Label>
        <Input id="featureList" {...form.register("featureList")} />
      </div>
    </>
  );
};

export default PropertyFormFields;