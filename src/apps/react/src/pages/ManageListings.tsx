import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useProperties } from "@/hooks/useProperties";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/properties/PageHeader";
import SearchAndFilter from "@/components/properties/SearchAndFilter";
import PropertiesTable from "@/components/properties/PropertiesTable";
import AgentFooter from "@/components/properties/AgentFooter";
import { NeighborhoodResponse, PropertyResponse, searchPropertyTypesEndpoint, searchPropertyStatusesEndpoint, PropertyTypeResponse, PropertyStatusResponse } from "@/api/homemapapi";
import { useNavigate } from "react-router-dom";

const ManageListings = () => {
  const { agentNeighborhoods, currentAgent, agentProperties } = useProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("");
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeResponse[]>([]);
  const [propertyStatuses, setPropertyStatuses] = useState<PropertyStatusResponse[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const navigate = useNavigate();

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

  const handleAddProperty = () => {
    navigate("/add-property");
  };
  const handleEditProperty = (id: string) => {
    navigate(`/edit-property/${id}`);
  };

  const handleDeleteProperty = (id: string) => {
    toast({
      title: "מחיקת נכס",
      description: `הנכס ${id} נמחק בהצלחה`,
      variant: "destructive",
    });
  };

  useEffect(() => {
    setLoadingTypes(true);
    searchPropertyTypesEndpoint({ pageNumber: 1, pageSize: 100 }, "1")
      .then(res => {
        setPropertyTypes(res.items || []);
      })
      .finally(() => setLoadingTypes(false));
  }, []);

  useEffect(() => {
    setLoadingStatuses(true);
    searchPropertyStatusesEndpoint({ pageNumber: 1, pageSize: 100 }, "1")
      .then(res => {
        setPropertyStatuses(res.items || []);
      })
      .finally(() => setLoadingStatuses(false));
  }, []);

  // Map API data to UI models
  //const neighborhoods: Neighborhood[] = agentNeighborhoods.map(mapNeighborhood);
  //const properties: Property[] = agentProperties.map(mapProperty);

  // Filter agent properties by search term and neighborhood
  const filteredProperties = agentProperties
    .filter((property) => {
      const matchesSearch =
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNeighborhood =
        selectedNeighborhood === "" || property.neighborhoodId === agentNeighborhoods.find(n => n.id === selectedNeighborhood)?.name;
      return matchesSearch && matchesNeighborhood;
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return sortDirection === "asc"
          ? a.askingPrice - b.askingPrice
          : b.askingPrice - a.askingPrice;
      } else if (sortBy === "date") {
        return sortDirection === "asc"
          ? new Date(a.listedDate).getTime() - new Date(b.listedDate).getTime()
          : new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
      } else if (sortBy === "title") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
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
            availableNeighborhoods={agentNeighborhoods}
          />
          <PropertiesTable
            properties={filteredProperties}
            neighborhoods={agentNeighborhoods}
            propertyTypes={propertyTypes}
            propertyStatuses={propertyStatuses}
            sortBy={sortBy}
            sortDirection={sortDirection}
            handleSort={handleSort}
            handleEditProperty={handleEditProperty}
            handleDeleteProperty={handleDeleteProperty}
          />
        </div>
      </main>
      <AgentFooter agent={currentAgent && currentAgent.id ? currentAgent : undefined} />
    </div>
  );
};

export default ManageListings;
