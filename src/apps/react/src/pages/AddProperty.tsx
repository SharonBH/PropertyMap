
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

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().regex(/^\d+$/, "Must be a valid number"),
  bedrooms: z.string().regex(/^\d+$/, "Must be a valid number"),
  bathrooms: z.string().regex(/^\d+$/, "Must be a valid number"),
  size: z.string().regex(/^\d+$/, "Must be a valid number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  status: z.enum(["active", "pending", "sold"]),
  neighborhoodId: z.string().min(1, "Please select a neighborhood"),
  markerPosition: z.object({
    yaw: z.number(),
    pitch: z.number(),
  }),
});

const AddProperty = () => {
  const navigate = useNavigate();
  const { neighborhoods } = useProperties();
  const { toast } = useToast();
  const [selectedNeighborhood, setSelectedNeighborhood] = React.useState(neighborhoods[0]);

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
      markerPosition: { yaw: 0, pitch: 0 },
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Submitting property with values:", values);
    toast({
      title: "Property Added",
      description: `Property "${values.title}" has been added with marker position: Yaw ${values.markerPosition.yaw.toFixed(2)}, Pitch ${values.markerPosition.pitch.toFixed(2)}`,
    });
    navigate("/properties");
  };

  const handleNeighborhoodChange = (value: string) => {
    const neighborhood = neighborhoods.find(n => n.id === value);
    if (neighborhood) {
      setSelectedNeighborhood(neighborhood);
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
        <h1 className="text-3xl font-bold mb-8">Add New Property</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PropertyFormFields
                form={form}
                neighborhoods={neighborhoods}
                onNeighborhoodChange={handleNeighborhoodChange}
              />
              
              <div className="space-y-2 p-4 border rounded-md bg-background">
                <h3 className="font-medium">Marker Position</h3>
                {hasMarkerPosition ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Yaw:</span>
                      <span className="text-sm">{markerPosition.yaw.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Pitch:</span>
                      <span className="text-sm">{markerPosition.pitch.toFixed(4)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No marker placed yet. Click on the sphere or use the "Set Marker at Center" button.
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={!hasMarkerPosition}
              >
                {hasMarkerPosition ? "Add Property" : "Place a marker first"}
              </Button>
            </form>
          </Form>

          <div className="rounded-lg overflow-hidden border border-input bg-background">
            <MarkerPositioner
              neighborhood={selectedNeighborhood}
              onPositionChange={(position) => {
                form.setValue("markerPosition", position);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProperty;
