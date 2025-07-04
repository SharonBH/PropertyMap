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
import { searchPropertyTypesEndpoint, createPropertyEndpoint } from "@/api/homemapapi";

const formSchema = z.object({
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

const AddProperty = () => {
  const navigate = useNavigate();
  const { agentNeighborhoods } = useProperties();
  const { toast } = useToast();
  const [selectedNeighborhood, setSelectedNeighborhood] = React.useState(agentNeighborhoods[0]);
  const [propertyTypes, setPropertyTypes] = React.useState<any[]>([]);
  const [loadingTypes, setLoadingTypes] = React.useState(true);

  React.useEffect(() => {
    setLoadingTypes(true);
    searchPropertyTypesEndpoint({ pageNumber: 1, pageSize: 100 }, "1")
      .then(res => {
        setPropertyTypes(res.items || []);
      })
      .finally(() => setLoadingTypes(false));
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      size: "",
      address: "",
      status: "active",
      neighborhoodId: "",
      propertyTypeId: "",
      featureList: "",
      markerPosition: { yaw: 0, pitch: 0 },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload = {
      name: values.title,
      description: values.description,
      neighborhoodId: values.neighborhoodId,
      address: values.address,
      askingPrice: Number(values.price),
      size: Number(values.size),
      rooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),
      propertyTypeId: values.propertyTypeId,
      featureList: values.featureList,
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
      setSelectedNeighborhood(neighborhood);
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
          </Form>

         <div className="rounded-lg overflow-hidden border border-input bg-background">
            {selectedNeighborhood && (
              <MarkerPositioner
                neighborhood={selectedNeighborhood}
                onPositionChange={(position) => {
                  form.setValue("markerPosition", position);
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProperty;