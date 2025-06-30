import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { useProperties } from "@/hooks/useProperties";
import { PropertyResponse } from "@/api/homemapapi";
import NeighborhoodViewer from "@/components/neighborhood/NeighborhoodViewer";
import NeighborhoodOverlay from "@/components/neighborhood/NeighborhoodOverlay";

const NeighborhoodMap = () => {
  // Use useProperties to get all API data
  const { agentNeighborhoods, agentProperties } = useProperties();

  // Use state for selected neighborhood only (no URL param)
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string | undefined>(
    agentNeighborhoods.length > 0 ? agentNeighborhoods[0].id : undefined
  );

  useEffect(() => {
    // If agentNeighborhoods changes, reset to first neighborhood
    if (agentNeighborhoods.length > 0 && !selectedNeighborhoodId) {
      setSelectedNeighborhoodId(agentNeighborhoods[0].id);
    }
  }, [agentNeighborhoods, selectedNeighborhoodId]);

  const neighborhood = agentNeighborhoods.find((n) => n.id === selectedNeighborhoodId) || null;
  const props = selectedNeighborhoodId ? agentProperties.filter((p) => p.neighborhoodId === selectedNeighborhoodId) : [];
  const [selectedProperty, setSelectedProperty] = useState<PropertyResponse | null>(null);

  // Memoize the callback to prevent unnecessary re-renders
  const handleSelectProperty = useCallback((property: PropertyResponse | null) => {
    setSelectedProperty(property);
  }, []);

  // Only update selectedProperty if the property list changes
  useEffect(() => {
    setSelectedProperty(null);
  }, [selectedNeighborhoodId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 relative">
      <Navbar />
      <NeighborhoodOverlay
        neighborhoods={agentNeighborhoods}
        selectedId={selectedNeighborhoodId}
        onSelect={setSelectedNeighborhoodId}
      />
      <div className="absolute inset-0 mt-16 flex items-center justify-center z-10">
        <NeighborhoodViewer
          neighborhood={neighborhood}
          properties={props}
          selectedProperty={selectedProperty}
          onSelectProperty={handleSelectProperty}
        />
      </div>
    </div>
  );
};

export default NeighborhoodMap;
