
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useProperties } from "@/hooks/useProperties";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/properties/PageHeader";
import SearchAndFilter from "@/components/properties/SearchAndFilter";
import PropertiesTable from "@/components/properties/PropertiesTable";
import AgentFooter from "@/components/properties/AgentFooter";

const ManageListings = () => {
  const { neighborhoods, currentAgent, agentProperties } = useProperties();
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

  // Filter agent properties by search term and neighborhood
  const filteredProperties = agentProperties
    .filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesNeighborhood = 
        selectedNeighborhood === "" || property.neighborhood === selectedNeighborhood;
      
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

  // Get neighborhoods available to current agent
  const agentNeighborhoods = neighborhoods.filter(n => 
    currentAgent.neighborhoods.includes(n.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
      <Navbar />
      
      <main className="container px-4 py-8 animate-fade-in">
        <PageHeader 
          agentName={currentAgent.name}
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
