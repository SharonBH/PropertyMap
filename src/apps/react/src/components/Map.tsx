
import React, { useEffect, useRef, useState } from "react";
import { Property, Neighborhood } from "@/lib/data";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapProps {
  properties: Property[];
  neighborhood: Neighborhood | null;
  onSelectProperty: (property: Property) => void;
  selectedProperty?: Property | null;
}

// Mock map component with a panoramic image
const Map: React.FC<MapProps> = ({ 
  properties, 
  neighborhood, 
  onSelectProperty,
  selectedProperty 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Sample panoramic images for different neighborhoods
  const panoramaImages: {[key: string]: string} = {
    n1: "https://images.unsplash.com/photo-1488926756850-a13b25e2f415?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80", // City panorama
    n2: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80", // Urban skyline
    n3: "https://images.unsplash.com/photo-1546436836-07a872a2de98?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80", // Residential area
    n4: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80", // Urban residential
    n5: "https://images.unsplash.com/photo-1565118531796-763e5082d113?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80", // Beach area
    default: "https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80", // Default panorama
  };

  // Get the appropriate panorama image based on neighborhood
  const getPanoramaImage = () => {
    if (!neighborhood) return panoramaImages.default;
    return panoramaImages[neighborhood.id] || panoramaImages.default;
  };

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-soft transition-all duration-500">
      {/* Map placeholder with panorama image */}
      <div 
        ref={mapRef} 
        className={cn(
          "absolute inset-0 bg-estate-light-gray transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{
          backgroundImage: `url('${getPanoramaImage()}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-estate-light-gray">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-estate-blue border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-estate-blue font-medium">טוען מפה...</p>
          </div>
        </div>
      )}

      {/* Map pins for properties */}
      {isLoaded && properties.map((property) => (
        <button
          key={property.id}
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10",
            selectedProperty?.id === property.id ? "scale-125 z-20" : "hover:scale-110",
          )}
          style={{
            // Simulate positions on the map
            top: `${30 + Math.random() * 40}%`,
            left: `${30 + Math.random() * 40}%`,
          }}
          onClick={() => onSelectProperty(property)}
          aria-label={`בחר נכס: ${property.title}`}
        >
          <div className={cn(
            "flex flex-col items-center",
            selectedProperty?.id === property.id ? "text-estate-blue" : "text-estate-teal"
          )}>
            <MapPin className={cn(
              "h-8 w-8 drop-shadow-md transition-all duration-300",
              selectedProperty?.id === property.id ? "fill-estate-blue stroke-white" : "fill-estate-teal stroke-white",
            )} />
            {selectedProperty?.id === property.id && (
              <div className="px-3 py-1 mt-1 text-xs font-bold bg-white rounded-full shadow-md whitespace-nowrap animate-fade-in">
                {property.title}
              </div>
            )}
          </div>
        </button>
      ))}

      {/* Map overlay with neighborhood name */}
      {neighborhood && (
        <div className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-md animate-fade-in">
          <h3 className="text-lg font-bold text-estate-blue">{neighborhood.name}</h3>
          <p className="text-sm text-estate-dark-gray">{properties.length} נכסים</p>
        </div>
      )}
    </div>
  );
};

export default Map;
