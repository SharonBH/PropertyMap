
import React, { useState } from "react";
import NeighborhoodSelector from "@/components/NeighborhoodSelector";
import PropertyCard from "@/components/PropertyCard";
import Earth3D from "@/components/Earth3D";
import { Neighborhood, Property } from "@/lib/data";
import { Building, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PropertySectionProps {
  neighborhoods: Neighborhood[];
  selectedNeighborhood: Neighborhood | null;
  filteredProperties: Property[];
  onSelectNeighborhood: (neighborhoodId: string) => void;
}

const PropertySection: React.FC<PropertySectionProps> = ({
  neighborhoods,
  selectedNeighborhood,
  filteredProperties,
  onSelectNeighborhood,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    
    // Scroll to property card on mobile
    if (window.innerWidth < 768) {
      const element = document.getElementById(`property-${property.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <NeighborhoodSelector
        neighborhoods={neighborhoods}
        selectedNeighborhood={selectedNeighborhood}
        onSelectNeighborhood={onSelectNeighborhood}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 h-[500px] rounded-lg overflow-hidden">
          <div className="relative h-full">
            <Earth3D 
              properties={filteredProperties}
              neighborhood={selectedNeighborhood}
              onSelectProperty={handleSelectProperty}
              selectedProperty={selectedProperty}
            />
            
            {selectedNeighborhood && (
              <Link 
                to={`/neighborhood/${selectedNeighborhood.id}`}
                className="absolute bottom-4 right-4 z-10"
              >
                <Button className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  <span>צפה בשכונה בתלת מימד</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div 
                key={property.id}
                id={`property-${property.id}`}
                onClick={() => setSelectedProperty(property)}
              >
                <PropertyCard 
                  property={property} 
                  isHighlighted={selectedProperty?.id === property.id}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Building className="h-12 w-12 text-estate-teal mb-4" />
              <h3 className="text-xl font-bold text-estate-dark-gray dark:text-gray-200 mb-2">אין נכסים זמינים</h3>
              <p className="text-gray-600 dark:text-gray-400">
                לא נמצאו נכסים בשכונה זו. אנא בחר שכונה אחרת.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PropertySection;
