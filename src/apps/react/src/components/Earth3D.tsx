import React from "react";
import { Property, Neighborhood } from "@/lib/data";
import Map from "./Map";
import { NeighborhoodResponse } from "@/api/homemapapi";
import { mapNeighborhood } from "@/lib/apiMappers";

interface Earth3DProps {
  properties: Property[];
  neighborhood: NeighborhoodResponse | null;
  onSelectProperty: (property: Property) => void;
  selectedProperty: Property | null;
}

const Earth3D: React.FC<Earth3DProps> = ({ 
  neighborhood, 
  properties, 
  onSelectProperty, 
  selectedProperty 
}) => {
  // Map API model to UI model for Map component
  const mappedNeighborhood = neighborhood ? mapNeighborhood(neighborhood) : null;
  if (!mappedNeighborhood) {
    return (
      <div className="flex items-center justify-center h-full bg-estate-light-gray rounded-lg">
        <p className="text-estate-dark-gray font-medium">בחר שכונה להצגת מפה</p>
      </div>
    );
  }

  return (
    <Map 
      properties={properties} 
      neighborhood={mappedNeighborhood} 
      onSelectProperty={onSelectProperty}
      selectedProperty={selectedProperty}
    />
  );
};

export default Earth3D;
