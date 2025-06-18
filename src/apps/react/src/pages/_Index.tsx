import React from "react";
import AgentInfo from "@/components/AgentInfo";
import { useProperties } from "@/hooks/useProperties";
import Header from "@/components/HomePage/Header";
import PropertySection from "@/components/HomePage/PropertySection";
import SoldPropertiesSection from "@/components/HomePage/SoldPropertiesSection";
import ReviewsSection from "@/components/HomePage/ReviewsSection";
import WhyChooseUsSection from "@/components/HomePage/WhyChooseUsSection";
import Footer from "@/components/HomePage/Footer";
import { Neighborhood, Property } from "@/lib/data";
import { NeighborhoodResponse, PropertyResponse } from "@/api/homemapapi";
import { mapNeighborhood, mapProperty, mapReview } from "@/lib/apiMappers";

const Index = () => {
  const {
    currentAgent,
    agentNeighborhoods,
    selectedNeighborhood,
    filteredProperties,
    agentProperties,
    soldProperties,
    agentReviews,
    selectNeighborhood,
  } = useProperties();

  // Map API data to UI models
  const neighborhoods: Neighborhood[] = agentNeighborhoods.map(mapNeighborhood);
  const filteredProps: Property[] = filteredProperties.map(mapProperty);
  const agentProps: Property[] = agentProperties.map(mapProperty);
  const soldProps: Property[] = (soldProperties || []).map(mapProperty);
  const reviews = (agentReviews || []).map(mapReview);

  //check if user is logged in, if not redirect to login page
  if (!currentAgent) {
    window.location.href = "/login";
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
      <main className="container px-4 py-8 animate-fade-in">
        <Header />
        
        {/* Agent information card */}
        <div className="mb-8">
          <AgentInfo 
            agent={currentAgent}
            neighborhoodCount={neighborhoods.length}
            propertyCount={agentProps.length}
          />
        </div>
        
        <PropertySection 
          neighborhoods={neighborhoods}
          selectedNeighborhood={selectedNeighborhood}
          filteredProperties={filteredProps}
          onSelectNeighborhood={selectNeighborhood}
        />
        
        <SoldPropertiesSection soldProperties={soldProps} />
        
        <ReviewsSection reviews={reviews} />
        
        <WhyChooseUsSection />
      </main>
      
      <Footer agent={currentAgent} />
    </div>
  );
};

export default Index;
