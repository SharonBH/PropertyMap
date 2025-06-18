import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useProperties } from "@/hooks/useProperties";
import { PropertyResponse, getNeighborhoodEndpoint, searchPropertiesEndpoint, NeighborhoodResponse } from "@/api/homemapapi";
import NeighborhoodViewer from "@/components/neighborhood/NeighborhoodViewer";
import NeighborhoodOverlay from "@/components/neighborhood/NeighborhoodOverlay";

const fetchPropertiesByNeighborhoodId = async (id: string): Promise<PropertyResponse[]> => {
  const res = await searchPropertiesEndpoint({
    advancedFilter: {
      field: "neighborhoodId",
      operator: "eq",
      value: id,
    },
    pageNumber: 1,
    pageSize: 100,
  });
  return res.items || [];
};

const NeighborhoodMap = () => {
  // Use useProperties to get all API data
  const { agentNeighborhoods: initialNeighborhoods } = useProperties();

  // Local state for neighborhoods and properties
  const [agentNeighborhoods, setAgentNeighborhoods] = useState(initialNeighborhoods);
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string | undefined>(
    initialNeighborhoods.length > 0 ? initialNeighborhoods[0].id : undefined
  );
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyResponse | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodResponse | null>(null);

  // Sync local neighborhoods with hook
  useEffect(() => {
    if (agentNeighborhoods.length === 0) {
      setAgentNeighborhoods(initialNeighborhoods);
      if (initialNeighborhoods.length > 0 && !selectedNeighborhoodId) {
        setSelectedNeighborhoodId(initialNeighborhoods[0].id);
      }
    }
  }, [initialNeighborhoods, selectedNeighborhoodId, agentNeighborhoods.length]);

  // Fetch selected neighborhood from API
  useEffect(() => {
    const fetchSelectedNeighborhood = async () => {
      if (!selectedNeighborhoodId) {
        setSelectedNeighborhood(null);
        return;
      }
      const neighborhood = await getNeighborhoodEndpoint(selectedNeighborhoodId);
      setSelectedNeighborhood(neighborhood);
    };
    fetchSelectedNeighborhood();
  }, [selectedNeighborhoodId]);

  // Fetch properties for selected neighborhood
  useEffect(() => {
    const fetchProperties = async () => {
      if (!selectedNeighborhoodId) {
        setProperties([]);
        return;
      }
      const props = await fetchPropertiesByNeighborhoodId(selectedNeighborhoodId);
      setProperties(props);
      setSelectedProperty(null);
    };
    fetchProperties();
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
          neighborhood={selectedNeighborhood}
          properties={properties}
          selectedProperty={selectedProperty}
          onSelectProperty={setSelectedProperty}
        />
      </div>
    </div>
  );
};

export default NeighborhoodMap;
