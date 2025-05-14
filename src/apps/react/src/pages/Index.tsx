
import React from "react";
import AgentInfo from "@/components/AgentInfo";
import { useProperties } from "@/hooks/useProperties";
import Header from "@/components/HomePage/Header";
import PropertySection from "@/components/HomePage/PropertySection";
import SoldPropertiesSection from "@/components/HomePage/SoldPropertiesSection";
import ReviewsSection from "@/components/HomePage/ReviewsSection";
import WhyChooseUsSection from "@/components/HomePage/WhyChooseUsSection";
import Footer from "@/components/HomePage/Footer";

const Index = () => {
  const { 
    currentAgent,
    agentNeighborhoods, 
    selectedNeighborhood, 
    filteredProperties,
    agentProperties,
    soldProperties,
    agentReviews,
    selectNeighborhood
  } = useProperties();
  
  console.log('Sold Properties:', soldProperties);
  console.log('Agent Reviews:', agentReviews);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
      <main className="container px-4 py-8 animate-fade-in">
        <Header />
        
        {/* Agent information card */}
        <div className="mb-8">
          <AgentInfo 
            agent={currentAgent}
            neighborhoodCount={agentNeighborhoods.length}
            propertyCount={agentProperties.length}
          />
        </div>
        
        <PropertySection 
          neighborhoods={agentNeighborhoods}
          selectedNeighborhood={selectedNeighborhood}
          filteredProperties={filteredProperties}
          onSelectNeighborhood={selectNeighborhood}
        />
        
        <SoldPropertiesSection soldProperties={soldProperties || []} />
        
        <ReviewsSection reviews={agentReviews || []} />
        
        <WhyChooseUsSection />
      </main>
      
      <Footer agent={currentAgent} />
    </div>
  );
};

export default Index;
