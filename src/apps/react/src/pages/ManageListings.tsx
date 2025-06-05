import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useProperties } from "@/hooks/useProperties";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/properties/PageHeader";
import SearchAndFilter from "@/components/properties/SearchAndFilter";
import PropertiesTable from "@/components/properties/PropertiesTable";
import AgentFooter from "@/components/properties/AgentFooter";
import { Neighborhood, Property } from "@/lib/data";
import { NeighborhoodResponse, PropertyResponse } from "@/api/homemapapi";

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

const ManageListings = () => {
  const { agentNeighborhoods, currentAgent, agentProperties } = useProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("");

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      toggleSortDirection();
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  const handleEditProperty = (id: string) => {
    toast({
      title: "עריכת נכס",
      description: `פתיחת הנכס ${id} לעריכה`,
    });
  };

  const handleDeleteProperty = (id: string) => {
    toast({
      title: "מחיקת נכס",
      description: `הנכס ${id} נמחק בהצלחה`,
      variant: "destructive",
    });
  };

  const handleAddProperty = () => {
    toast({
      title: "הוספת נכס חדש",
      description: "פתיחת טופס הוספת נכס חדש",
    });
  };

  // Map API data to UI models
  const neighborhoods: Neighborhood[] = agentNeighborhoods.map(mapNeighborhood);
  const properties: Property[] = agentProperties.map(mapProperty);

  // Filter agent properties by search term and neighborhood
  const filteredProperties = properties
    .filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNeighborhood =
        selectedNeighborhood === "" || property.neighborhood === neighborhoods.find(n => n.id === selectedNeighborhood)?.name;
      return matchesSearch && matchesNeighborhood;
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return sortDirection === "asc"
          ? a.price - b.price
          : b.price - a.price;
      } else if (sortBy === "date") {
        return sortDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "title") {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
      <Navbar />
      <main className="container px-4 py-8 animate-fade-in">
        <PageHeader 
          agentName={currentAgent?.name || ""}
          handleAddProperty={handleAddProperty}
        />
        <div className="bg-white rounded-lg shadow-soft overflow-hidden mb-8">
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedNeighborhood={selectedNeighborhood}
            setSelectedNeighborhood={setSelectedNeighborhood}
            availableNeighborhoods={neighborhoods}
          />
          <PropertiesTable
            properties={filteredProperties}
            neighborhoods={neighborhoods}
            sortBy={sortBy}
            sortDirection={sortDirection}
            handleSort={handleSort}
            handleEditProperty={handleEditProperty}
            handleDeleteProperty={handleDeleteProperty}
          />
        </div>
      </main>
      <AgentFooter agent={currentAgent} />
    </div>
  );
};

export default ManageListings;
