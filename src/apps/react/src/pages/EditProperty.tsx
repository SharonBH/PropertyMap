import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useProperties } from "@/hooks/useProperties";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MarkerPositioner from "@/components/MarkerPositioner";
import Navbar from "@/components/Navbar";
import PropertyFormFields from "@/components/property/PropertyFormFields";
import { searchPropertyTypesEndpoint, updatePropertyEndpoint, getPropertyEndpoint, PropertyTypeResponse, searchPropertyStatusesEndpoint, PropertyStatusResponse, getNeighborhoodEndpoint } from "@/api/homemapapi";
import { resolveImageUrl, resolveNeighborhoodUrl } from "@/lib/imageUrl";
import type { PropertyFormSchema } from "@/components/property/PropertyFormFields";
import type { NeighborhoodResponse } from "@/api/homemapapi";
import PropertySphereMarkerDemo from "@/components/property/PropertySphereMarkerDemo";

const formSchema = z.object({
  title: z.string().min(2, "הכותרת חייבת להכיל לפחות 2 תווים"),
  description: z.string().min(10, "התיאור חייב להכיל לפחות 10 תווים"),
  price: z.string().regex(/^\d+$/, "יש להזין מספר חוקי"),
  bedrooms: z.string().regex(/^\d+$/, "יש להזין מספר חוקי"),
  bathrooms: z.string().regex(/^\d+$/, "יש להזין מספר חוקי"),
  size: z.string().regex(/^\d+$/, "יש להזין מספר חוקי"),
  address: z.string().min(5, "הכתובת חייבת להכיל לפחות 5 תווים"),
  propertyStatusId: z.string().min(1, "יש לבחור סטטוס"),
  neighborhoodId: z.string().min(1, "יש לבחור שכונה"),
  propertyTypeId: z.string().min(1, "יש לבחור סוג נכס"),
  featureList: z.string().optional(),
  markerPosition: z.object({
    yaw: z.number(),
    pitch: z.number(),
  }),
  images: z.array(z.object({ url: z.string().min(1), isMain: z.boolean() })).min(1, "יש להעלות לפחות תמונה אחת"),
});

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentAgent, agentNeighborhoods } = useProperties();
  const { toast } = useToast();
  const [selectedNeighborhood, setSelectedNeighborhood] = React.useState<NeighborhoodResponse | null>(null);
  const [propertyTypes, setPropertyTypes] = React.useState<PropertyTypeResponse[]>([]);
  const [loadingTypes, setLoadingTypes] = React.useState(true);
  const [loadingProperty, setLoadingProperty] = React.useState(true);
  const [propertyStatuses, setPropertyStatuses] = React.useState<PropertyStatusResponse[]>([]);
  const [loadingStatuses, setLoadingStatuses] = React.useState(true);
  const [loadingNeighborhood, setLoadingNeighborhood] = React.useState(true);

  const form = useForm<PropertyFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      size: "",
      address: "",
      propertyStatusId: "",
      neighborhoodId: "",
      propertyTypeId: "",
      featureList: "",
      markerPosition: { yaw: 0, pitch: 0 },
      images: [],
    },
  });

  React.useEffect(() => {
    setLoadingTypes(true);
    searchPropertyTypesEndpoint({ pageNumber: 1, pageSize: 100 }, "1")
      .then(res => {
        setPropertyTypes(res.items || []);
      })
      .finally(() => setLoadingTypes(false));
    setLoadingStatuses(true);
    searchPropertyStatusesEndpoint({ pageNumber: 1, pageSize: 100 }, "1")
      .then(res => {
        setPropertyStatuses(res.items || []);
      })
      .finally(() => setLoadingStatuses(false));
    setLoadingProperty(true);
    getPropertyEndpoint(id!, "1")
      .then(res => {
        // Log markerYaw and markerPitch for debugging
        console.log('[EditProperty] markerYaw:', res.markerYaw, 'markerPitch:', res.markerPitch);
        form.reset({
          title: res.name,
          description: res.description,
          price: res.askingPrice?.toString() ?? "",
          bedrooms: res.rooms?.toString() ?? "",
          bathrooms: res.bathrooms?.toString() ?? "",
          size: res.size?.toString() ?? "",
          address: res.address,
          propertyStatusId: res.propertyStatusId ?? "",
          neighborhoodId: res.neighborhoodId ?? "",
          propertyTypeId: res.propertyTypeId ?? "",
          featureList: res.featureList ?? "",
          markerPosition: {
            yaw: typeof res.markerYaw === 'number' ? res.markerYaw : 0,
            pitch: typeof res.markerPitch === 'number' ? res.markerPitch : 0,
          },
          images: Array.isArray(res.images)
            ? res.images.map(img => ({ url: resolveImageUrl(img.imageUrl ? img.imageUrl : ""), isMain: img.isMain }))
            : [],
        });
      })
      .finally(() => setLoadingProperty(false));
    // eslint-disable-next-line
  }, [id]);

  React.useEffect(() => {
    setLoadingNeighborhood(true);
    getPropertyEndpoint(id!, "1")
      .then(property => {
        if (property.neighborhoodId) {
          getNeighborhoodEndpoint(property.neighborhoodId, "1")
            .then(res => {
              if (res.id) {
                setSelectedNeighborhood(res);
              }
            })
            .finally(() => setLoadingNeighborhood(false));
        } else {
          setLoadingNeighborhood(false);
        }
      });
  }, [id]);

  const onSubmit = async (values: z.infer<typeof formSchema> & { images: { url: string; isMain: boolean }[] }) => {
    const payload = {
      name: values.title,
      description: values.description,
      neighborhoodId: values.neighborhoodId,
      agencyId: currentAgent?.agency?.id || "",
      address: values.address,
      askingPrice: Number(values.price),
      size: Number(values.size),
      rooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),
      propertyTypeId: values.propertyTypeId,
      propertyStatusId: values.propertyStatusId,
      featureList: values.featureList,
      markerYaw: values.markerPosition.yaw,
      markerPitch: values.markerPosition.pitch,
      images: values.images?.map(img => ({ imageUrl: resolveImageUrl(img.url), isMain: img.isMain })) ?? [],
    };
    try {
      await updatePropertyEndpoint(id!, payload, "1");
      toast({
        title: "Property Updated",
        description: `Property "${values.title}" has been updated.`,
      });
      navigate("/properties");
    } catch (err) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת עדכון הנכס.",
        variant: "destructive",
      });
    }
  };

  const handleNeighborhoodChange = (value: string) => {
    setLoadingNeighborhood(true);
    getNeighborhoodEndpoint(value, "1")
      .then(res => {
        if (res.id === value) {
          setSelectedNeighborhood(res);
          form.setValue("markerPosition", { yaw: 0, pitch: 0 });
        }
      })
      .finally(() => setLoadingNeighborhood(false));
  };

  // Ensure markerPosition has default values to prevent undefined errors
  const watchedMarkerPosition = form.watch("markerPosition");
  const markerPosition =
    watchedMarkerPosition && typeof watchedMarkerPosition.yaw === 'number' && typeof watchedMarkerPosition.pitch === 'number'
      ? watchedMarkerPosition
      : { yaw: 0, pitch: 0 };
  const hasMarkerPosition = markerPosition.yaw !== 0 || markerPosition.pitch !== 0;

  if (loadingProperty) {
    return <div>טוען נתוני נכס...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      <main className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">עריכת נכס</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PropertyFormFields
                form={form}
                neighborhoods={agentNeighborhoods}
                onNeighborhoodChange={handleNeighborhoodChange}
                propertyTypes={propertyTypes}
                loadingTypes={loadingTypes}
                propertyStatuses={propertyStatuses}
                loadingStatuses={loadingStatuses}
              />
              <div className="space-y-2 p-4 border rounded-md bg-background">
                <h3 className="font-medium">מיקום סמן</h3>
                {hasMarkerPosition ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">יאו:</span>
                      <span className="text-sm">{markerPosition.yaw.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">פיץ':</span>
                      <span className="text-sm">{markerPosition.pitch.toFixed(4)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    לא הונח סמן עדיין. לחץ על הכדור או השתמש בכפתור "הצב סמן במרכז".
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={!hasMarkerPosition}>
                {hasMarkerPosition ? "עדכן נכס" : "יש להניח סמן קודם"}
              </Button>
            </form>
          </Form>
          <div className="rounded-lg overflow-hidden border border-input bg-background">
            {selectedNeighborhood && (
              <PropertySphereMarkerDemo
                panoramaUrl={resolveNeighborhoodUrl(selectedNeighborhood.sphereImgURL) || "https://localhost:7000/neighborhoods/16.jpg"}
                yaw={markerPosition.yaw}
                pitch={markerPosition.pitch}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProperty;
