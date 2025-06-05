import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useProperties } from "@/hooks/useProperties";
import { Property, Neighborhood } from "@/lib/data";
import { NeighborhoodResponse, PropertyResponse } from "@/api/homemapapi";
import NeighborhoodViewer from "@/components/neighborhood/NeighborhoodViewer";
import NeighborhoodOverlay from "@/components/neighborhood/NeighborhoodOverlay";

// Map API model to UI model
function mapNeighborhood(n: NeighborhoodResponse): Neighborhood {
  return {
    id: n.id || "",
    name: n.name || "",
    description: n.description || "",
    coordinates: { lat: 0, lng: 0 }, // No coordinates in API, fallback
    zoom: 15, // Default zoom
  };
}

function mapProperty(p: PropertyResponse): Property {
  return {
    id: p.id || "",
    title: p.name || "",
    address: p.address || "",
    neighborhood: p.neighborhoodName || "",
    price: p.askingPrice || 0,
    size: p.size || 0,
    bedrooms: p.rooms || 0,
    bathrooms: p.bathrooms || 0,
    description: p.description || "",
    images: [], // No images in API, fallback
    features: p.featureList ? p.featureList.split(",") : [],
    coordinates: { lat: 0, lng: 0 }, // No coordinates in API, fallback
    agentId: "", // Not in API response
    createdAt: p.listedDate || "",
    status: p.soldDate ? "sold" : "active",
    soldDate: p.soldDate || undefined,
    soldPrice: p.soldPrice || undefined,
  };
}

const NeighborhoodMap = () => {
  const { id } = useParams<{ id: string }>();
  // Use allProperties from useProperties (not exported by default)
  const { agentNeighborhoods, filteredProperties } = useProperties();
  // Map API data to UI models
  const neighborhoods: Neighborhood[] = agentNeighborhoods.map(mapNeighborhood);
  const properties: Property[] = filteredProperties.map(mapProperty);

  const getNeighborhoodById = (nid: string): Neighborhood | null => {
    return neighborhoods.find((n) => n.id === nid) || null;
  };
  const getPropertiesByNeighborhood = (nid: string): Property[] => {
    const neighborhood = getNeighborhoodById(nid);
    if (!neighborhood) return [];
    return properties.filter((p) => p.neighborhood === neighborhood.name);
  };

  const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(getNeighborhoodById(id || ""));
  const [props, setProps] = useState<Property[]>(getPropertiesByNeighborhood(id || ""));
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (id) {
      const foundNeighborhood = getNeighborhoodById(id);
      setNeighborhood(foundNeighborhood);
      setProps(getPropertiesByNeighborhood(id));
    }
  }, [id, filteredProperties, agentNeighborhoods]);
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
          properties={props}
          selectedProperty={selectedProperty}
          onSelectProperty={setSelectedProperty}
        />
      </div>
    </div>
  );
};

export default NeighborhoodMap;
