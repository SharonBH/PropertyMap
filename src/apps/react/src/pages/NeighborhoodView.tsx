
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/lib/data";
import PropertyCard from "@/components/PropertyCard";
import NeighborhoodHeader from "@/components/neighborhood/NeighborhoodHeader";
import NeighborhoodViewer from "@/components/neighborhood/NeighborhoodViewer";

const NeighborhoodView = () => {
  const { id } = useParams<{ id: string }>();
  const { getNeighborhoodById, getPropertiesByNeighborhood, neighborhoods } = useProperties();
  const [neighborhood, setNeighborhood] = useState(getNeighborhoodById(id || ''));
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundNeighborhood = getNeighborhoodById(id);
      if (foundNeighborhood) {
        setNeighborhood(foundNeighborhood);
        const neighborhoodProperties = getPropertiesByNeighborhood(id);
        setProperties(neighborhoodProperties);
      }
    }
  }, [id, getNeighborhoodById, getPropertiesByNeighborhood]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      
      <main className="container px-4 py-8">
        <NeighborhoodHeader 
          neighborhood={neighborhood}
          propertiesCount={properties.length}
          neighborhoods={neighborhoods}
          selectedId={id}
        />
        
        <NeighborhoodViewer
          neighborhood={neighborhood}
          properties={properties}
          selectedProperty={selectedProperty}
          onSelectProperty={setSelectedProperty}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property) => (
            <div 
              key={property.id} 
              className="cursor-pointer transition-transform hover:scale-[1.01]"
              onClick={() => setSelectedProperty(property)}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default NeighborhoodView;
