
import React from "react";
import { Property, Neighborhood } from "@/lib/data";
import Map from "./Map";

interface Earth3DProps {
  properties: Property[];
  neighborhood: Neighborhood | null;
  onSelectProperty: (property: Property) => void;
  selectedProperty: Property | null;
}

const Earth3D: React.FC<Earth3DProps> = ({ 
  neighborhood, 
  properties, 
  onSelectProperty, 
  selectedProperty 
}) => {
  if (!neighborhood) {
    return (
      <div className="flex items-center justify-center h-full bg-estate-light-gray rounded-lg">
        <p className="text-estate-dark-gray font-medium">בחר שכונה להצגת מפה</p>
      </div>
    );
  }

  return (
    <Map 
      properties={properties} 
      neighborhood={neighborhood} 
      onSelectProperty={onSelectProperty}
      selectedProperty={selectedProperty}
    />
  );
};

export default Earth3D;
