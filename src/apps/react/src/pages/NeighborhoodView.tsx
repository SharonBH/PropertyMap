import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/lib/data";
import PropertyCard from "@/components/PropertyCard";
import NeighborhoodHeader from "@/components/neighborhood/NeighborhoodHeader";
import NeighborhoodViewer from "@/components/neighborhood/NeighborhoodViewer";
import { mapNeighborhood, mapProperty } from "@/lib/apiMappers";
import AgentFooter from "@/components/properties/AgentFooter";

const NeighborhoodView = () => {
  const { id } = useParams<{ id: string }>();
  const { agentNeighborhoods, filteredProperties, currentAgent } = useProperties();
  // Map all neighborhoods to UI model
  const mappedNeighborhoods = agentNeighborhoods.map(mapNeighborhood);
  // Helper to get mapped neighborhood by id
  const getMappedNeighborhoodById = (nid: string) => {
    const n = agentNeighborhoods.find((n) => n.id === nid);
    return n ? mapNeighborhood(n) : null;
  };
  // Helper to get mapped properties by neighborhood id
  const getMappedPropertiesByNeighborhood = (nid: string) => {
    const neighborhood = agentNeighborhoods.find((n) => n.id === nid);
    if (!neighborhood) return [];
    return filteredProperties
      .filter((p) => p.neighborhoodName === neighborhood.name)
      .map(mapProperty);
  };
  const [neighborhood, setNeighborhood] = useState(getMappedNeighborhoodById(id || ''));
  const [properties, setProperties] = useState<Property[]>(getMappedPropertiesByNeighborhood(id || ''));
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  useEffect(() => {
    if (id) {
      setNeighborhood(getMappedNeighborhoodById(id));
      setProperties(getMappedPropertiesByNeighborhood(id));
    }
  }, [id, agentNeighborhoods, filteredProperties]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      
      <main className="container px-4 py-8">
        <NeighborhoodHeader 
          neighborhood={neighborhood}
          propertiesCount={properties.length}
          neighborhoods={mappedNeighborhoods}
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
          ))}        </div>      </main>
      <AgentFooter agent={currentAgent} />
    </div>
  );
};

export default NeighborhoodView;
