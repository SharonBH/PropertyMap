import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/lib/data";
import NeighborhoodViewer from "@/components/neighborhood/NeighborhoodViewer";
import NeighborhoodOverlay from "@/components/neighborhood/NeighborhoodOverlay";

const NeighborhoodMap = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 relative">
      <Navbar />
      <NeighborhoodOverlay
        neighborhoods={neighborhoods}
        selectedId={id}
        onSelect={(nid) => window.location.assign(`/neighborhood/${nid}`)}
      />
      <div className="absolute inset-0 mt-16 flex items-center justify-center z-10">
        <NeighborhoodViewer
          neighborhood={neighborhood}
          properties={properties}
          selectedProperty={selectedProperty}
          onSelectProperty={setSelectedProperty}
        />
      </div>
    </div>
  );
};

export default NeighborhoodMap;
