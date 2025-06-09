import React from 'react';
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
import { NeighborhoodResponse, PropertyTypeResponse, PropertyStatusResponse } from '@/api/homemapapi';

interface PropertyFormFieldsProps<T = unknown> {
  form: UseFormReturn<T>;
  neighborhoods: NeighborhoodResponse[];
  onNeighborhoodChange: (value: string) => void;
  propertyTypes: PropertyTypeResponse[];
  loadingTypes?: boolean;
  propertyStatuses: PropertyStatusResponse[];
  loadingStatuses?: boolean;
}

const PropertyFormFields = <T = unknown>({
  form,
  neighborhoods,
  onNeighborhoodChange,
  propertyTypes,
  loadingTypes,
  propertyStatuses,
  loadingStatuses,
}: PropertyFormFieldsProps<T>) => {
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
            <FormLabel>שכונה</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onNeighborhoodChange(value);
              }} 
              defaultValue={field.value}
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
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingTypes}>
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
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingStatuses}>
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
    </>
  );
};

export default PropertyFormFields;
