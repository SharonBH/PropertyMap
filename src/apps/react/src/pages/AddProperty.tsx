import React from "react";
import { useNavigate } from "react-router-dom";
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
import AgentFooter from "@/components/properties/AgentFooter";
import { searchPropertyTypesEndpoint, createPropertyEndpoint, searchPropertyStatusesEndpoint, PropertyTypeResponse, PropertyStatusResponse, NeighborhoodResponse, getNeighborhoodEndpoint } from "@/api/homemapapi";
import { resolveImageUrl } from "@/lib/imageUrl";
import type { PropertyFormSchema } from "@/components/property/PropertyFormFields";

const formSchema = z.object({
  title: z.string().min(2, "הכותרת חייבת להכיל לפחות 2 תווים"),
  description: z.string().min(10, "התיאור חייב להכיל לפחות 10 תווים"),
  price: z.string().regex(/^\d+$/, "יש להזין מספר חוקי"),
  bedrooms: z.string().regex(/^\d+$/, "יש להזין מספר חוקי"),
  bathrooms: z.string().regex(/^\d+$/, "יש להזין מספר חוקי"),
  size: z.string().regex(/^\d+$/, "יש להזין מספר חוקי"),
  address: z.string().min(5, "הכתובת חייבת להכיל לפחות 5 תווים"),
  neighborhoodId: z.string().min(1, "יש לבחור שכונה"),
  propertyTypeId: z.string().min(1, "יש לבחור סוג נכס"),
  featureList: z.string().optional(),
  markerPosition: z.object({
    yaw: z.number(),
    pitch: z.number(),
  }),
  propertyStatusId: z.string().min(1, "יש לבחור סטטוס"),
  images: z.array(z.object({
    url: z.string().min(1, "יש להזין כתובת תמונה חוקית"),
    isMain: z.boolean()
  })).min(1, "יש להעלות לפחות תמונה אחת"),
});

const AddProperty = () => {
  const navigate = useNavigate();  const { currentAgent, agentNeighborhoods } = useProperties();
  const { toast } = useToast();
  const [selectedNeighborhood, setSelectedNeighborhood] = React.useState<NeighborhoodResponse | null>(null);
  const [propertyTypes, setPropertyTypes] = React.useState<PropertyTypeResponse[]>([]);
  const [loadingTypes, setLoadingTypes] = React.useState(true);
  const [propertyStatuses, setPropertyStatuses] = React.useState<PropertyStatusResponse[]>([]);
  const [loadingStatuses, setLoadingStatuses] = React.useState(true);
  const [loadingNeighborhood, setLoadingNeighborhood] = React.useState(false);

  React.useEffect(() => {
    setLoadingTypes(true);
    searchPropertyTypesEndpoint({ pageNumber: 1, pageSize: 100 }, "1")
      .then(res => {
        setPropertyTypes(res.items || []);
      })
      .finally(() => setLoadingTypes(false));
  }, []);
  React.useEffect(() => {
    setLoadingStatuses(true);
    searchPropertyStatusesEndpoint({ pageNumber: 1, pageSize: 100 }, "1")
      .then(res => {
        setPropertyStatuses(res.items || []);
      })
      .finally(() => setLoadingStatuses(false));
  }, []);

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
      neighborhoodId: "",
      propertyTypeId: "",
      featureList: "",
      markerPosition: { yaw: 0, pitch: 0 },
      propertyStatusId: "",
      images: [],
    },
  });

  // Auto-select first neighborhood when neighborhoods are available
  React.useEffect(() => {
    if (agentNeighborhoods.length > 0 && !selectedNeighborhood) {
      const firstNeighborhood = agentNeighborhoods[0];
      setLoadingNeighborhood(true);
      getNeighborhoodEndpoint(firstNeighborhood.id, "1")
        .then(fullNeighborhood => {
          setSelectedNeighborhood(fullNeighborhood);
          form.setValue("neighborhoodId", firstNeighborhood.id);
          setLoadingNeighborhood(false);
        })
        .catch(error => {
          console.error("Error loading initial neighborhood:", error);
          setSelectedNeighborhood(firstNeighborhood);
          form.setValue("neighborhoodId", firstNeighborhood.id);
          setLoadingNeighborhood(false);
        });
    }
  }, [agentNeighborhoods, selectedNeighborhood, form]);

  const onSubmit = async (values: PropertyFormSchema) => {
    const payload = {
      name: values.title,
      description: values.description,
      neighborhoodId: values.neighborhoodId,
      agencyId: currentAgent?.agency?.id || "",
      address: values.address,
      listedDate: new Date().toISOString(),
      askingPrice: Number(values.price),
      size: Number(values.size),
      rooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),
      propertyTypeId: values.propertyTypeId,
      featureList: values.featureList,
      propertyStatusId: values.propertyStatusId,
      markerYaw: values.markerPosition.yaw,
      markerPitch: values.markerPosition.pitch,
      images: values.images.map(img => ({ imageUrl: resolveImageUrl(img.url), isMain: img.isMain })),
    };
    try {
      await createPropertyEndpoint(payload, "1");
      toast({
        title: "Property Added",
        description: `Property "${values.title}" has been added with marker position: Yaw ${values.markerPosition.yaw.toFixed(2)}, Pitch ${values.markerPosition.pitch.toFixed(2)}`,
      });
      navigate("/properties");
    } catch (err) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת הוספת הנכס.",
        variant: "destructive",
      });
    }
  };
  const handleNeighborhoodChange = (value: string) => {
    const neighborhood = agentNeighborhoods.find(n => n.id === value);
    if (neighborhood) {
      setLoadingNeighborhood(true);
      // Load the full neighborhood data from API to get sphereImgURL
      getNeighborhoodEndpoint(value, "1")
        .then(fullNeighborhood => {
          setSelectedNeighborhood(fullNeighborhood);
          setLoadingNeighborhood(false);
        })
        .catch(error => {
          console.error("Error loading neighborhood:", error);
          // Fallback to basic neighborhood data
          setSelectedNeighborhood(neighborhood);
          setLoadingNeighborhood(false);
        });
      
      // Reset marker position when neighborhood changes
      form.setValue("markerPosition", { yaw: 0, pitch: 0 });
    }
  };

  const markerPosition = form.watch("markerPosition");
  const hasMarkerPosition = markerPosition.yaw !== 0 || markerPosition.pitch !== 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      
      <main className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">הוספת נכס חדש</h1>

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

              <Button 
                type="submit" 
                className="w-full"
                disabled={!hasMarkerPosition}
              >
                {hasMarkerPosition ? "הוסף נכס" : "יש להניח סמן קודם"}
              </Button>
            </form>
          </Form>         <div className="rounded-lg overflow-hidden border border-input bg-background">
            {loadingNeighborhood ? (
              <div className="flex items-center justify-center h-96 bg-muted/50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">טוען תמונת שכונה...</p>
                </div>
              </div>
            ) : selectedNeighborhood ? (
              <MarkerPositioner
                neighborhood={selectedNeighborhood}
                onPositionChange={(position) => {
                  form.setValue("markerPosition", position);
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-96 bg-muted/50">
                <p className="text-sm text-muted-foreground">בחר שכונה כדי להציג את המפה</p>
              </div>
            )}
          </div>        </div>
      </main>
      <AgentFooter agent={currentAgent} />
    </div>
  );
};

export default AddProperty;
