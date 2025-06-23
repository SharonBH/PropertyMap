import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import SoldPropertyCard from "@/components/SoldPropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, CheckCircle, Search, Map } from "lucide-react";
import { Input } from "@/components/ui/input";
import AgentFooter from "@/components/properties/AgentFooter";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PropertiesPage = () => {
  const {  
    agentProperties, 
    soldProperties, 
    currentAgent,
    agentNeighborhoods
  } = useProperties();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;
  const navigate = useNavigate();
  
  // Filter properties based on search term
  const filterProperties = (propertyList) => {
    if (!searchTerm.trim()) return propertyList;
    
    const term = searchTerm.toLowerCase();
    return propertyList.filter(property => 
      property.title.toLowerCase().includes(term) || 
      property.address.toLowerCase().includes(term)
    );
  };
  
  const filteredActive = filterProperties(agentProperties);
  const filteredSold = filterProperties(soldProperties);
  
  // Pagination logic
  const getPageData = (data, page) => {
    const startIndex = (page - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    return data.slice(startIndex, endIndex);
  };
  
  const activePropertiesPage = getPageData(filteredActive, currentPage);
  const soldPropertiesPage = getPageData(filteredSold, currentPage);
  
  const totalActivePages = Math.ceil(filteredActive.length / propertiesPerPage);
  const totalSoldPages = Math.ceil(filteredSold.length / propertiesPerPage);
  
  const handleChangePage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const handleAddProperty = () => {
    navigate("/add-property");
  };
  
  const handleEditProperty = (id: string) => {
    navigate(`/edit-property/${id}`);
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      
      <main className="container px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">הנכסים שלנו</h1>
          <Button onClick={handleAddProperty} className="ml-4">הוסף נכס חדש</Button>
        </header>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Agent info */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">סוכן נדל"ן:</span>
              <span className="font-medium">{currentAgent && currentAgent.name ? currentAgent.name : "---"}</span>
            </div>
            
            {/* Search box */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש לפי כותרת או כתובת..."
                className="pl-10 pr-4"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          
          {/* Neighborhoods Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">שכונות</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {agentNeighborhoods.map((neighborhood) => (
                <Link 
                  key={neighborhood.id} 
                  to={`/neighborhood/${neighborhood.id}`}
                  className="block"
                >
                  <div className="flex flex-col items-center p-4 bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all">
                    <Map className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium text-center">{neighborhood.name}</h3>
                    <span className="text-xs text-muted-foreground mt-1">
                      {getPageData(filterProperties(agentProperties).filter(p => p.neighborhood === neighborhood.id), 1).length} נכסים
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>נכסים פעילים</span>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                  {filteredActive.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="sold" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>נכסים שנמכרו</span>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                  {filteredSold.length}
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="pt-2">
              {filteredActive.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {activePropertiesPage.map((property) => (
                      <div key={property.id} className="relative group">
                        <Link 
                          to={`/property/${property.id}`}
                          className="block transition-transform hover:scale-[1.01]"
                        >
                          <PropertyCard property={property} />
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition"
                          onClick={() => handleEditProperty(property.id)}
                        >
                          ערוך
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {totalActivePages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handleChangePage(currentPage - 1)} 
                            />
                          </PaginationItem>
                        )}
                        
                        {Array.from({ length: totalActivePages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink 
                              isActive={page === currentPage}
                              onClick={() => handleChangePage(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        {currentPage < totalActivePages && (
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handleChangePage(currentPage + 1)} 
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-lg shadow-sm">
                  <Building className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">אין נכסים פעילים</h3>
                  <p className="text-muted-foreground">
                    לא נמצאו נכסים פעילים התואמים את החיפוש שלך.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="sold" className="pt-2">
              {filteredSold.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {soldPropertiesPage.map((property) => (
                      <Link 
                        key={property.id} 
                        to={`/property/${property.id}`}
                        className="block transition-transform hover:scale-[1.01]"
                      >
                        <SoldPropertyCard property={property} />
                      </Link>
                    ))}
                  </div>
                  
                  {totalSoldPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handleChangePage(currentPage - 1)} 
                            />
                          </PaginationItem>
                        )}
                        
                        {Array.from({ length: totalSoldPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink 
                              isActive={page === currentPage}
                              onClick={() => handleChangePage(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        {currentPage < totalSoldPages && (
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handleChangePage(currentPage + 1)} 
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-lg shadow-sm">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">אין נכסים שנמכרו</h3>
                  <p className="text-muted-foreground">
                    לא נמצאו נכסים שנמכרו התואמים את החיפוש שלך.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>      </main>
      <AgentFooter agent={currentAgent} />
    </div>
  );
};

export default PropertiesPage;
