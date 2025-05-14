import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import {
  properties,
  neighborhoods,
  agents,
  reviews,
  Property,
  Neighborhood,
  Agent,
  Review,
  getPropertiesByNeighborhood,
  getNeighborhoodById,
  getAgentById,
  getPropertyById,
  getSoldPropertiesByAgent,
  getActivePropertiesByAgent,
  getReviewsByAgent,
  calculateAverageRating,
} from "@/lib/data";

export function useProperties() {
  const { currentAgent: authAgent } = useAuth();
  
  // Use the authenticated agent if available, otherwise fall back to the first agent
  const [currentAgent, setCurrentAgent] = useState<Agent>(authAgent || agents[0]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<
    Neighborhood | null
  >(null);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [agentNeighborhoods, setAgentNeighborhoods] = useState<Neighborhood[]>([]);
  const [soldProperties, setSoldProperties] = useState<Property[]>([]);
  const [agentReviews, setAgentReviews] = useState<Review[]>([]);

  // Update current agent when auth state changes
  useEffect(() => {
    if (authAgent) {
      setCurrentAgent(authAgent);
    }
  }, [authAgent]);

  // Initialize agent's neighborhoods and selected neighborhood
  useEffect(() => {
    if (currentAgent) {
      const agentNeighborhoodIds = currentAgent.neighborhoods;
      const neighborhoods = agentNeighborhoodIds.map(id => 
        getNeighborhoodById(id)
      ).filter(Boolean) as Neighborhood[];
      
      setAgentNeighborhoods(neighborhoods);
      
      // Default to first neighborhood in agent's list
      if (neighborhoods.length > 0 && !selectedNeighborhood) {
        setSelectedNeighborhood(neighborhoods[0]);
      }
      
      // Get sold properties for the current agent
      const soldProps = getSoldPropertiesByAgent(currentAgent.id);
      setSoldProperties(soldProps);
      
      // Get reviews for the current agent
      const reviews = getReviewsByAgent(currentAgent.id);
      setAgentReviews(reviews);
    }
  }, [currentAgent, selectedNeighborhood]);

  // Update filtered properties when selected neighborhood changes
  useEffect(() => {
    if (selectedNeighborhood) {
      const props = getPropertiesByNeighborhood(selectedNeighborhood.id);
      // Only include active properties belonging to current agent
      const agentProps = props.filter(
        prop => prop.agentId === currentAgent.id //&& prop.status === "active"
      );
      setFilteredProperties(agentProps);
    } else {
      setFilteredProperties([]);
    }
  }, [selectedNeighborhood, currentAgent]);

  const selectNeighborhood = (neighborhoodId: string) => {
    const neighborhood = getNeighborhoodById(neighborhoodId);
    setSelectedNeighborhood(neighborhood || null);
  };

  const selectAgent = (agentId: string) => {
    const agent = getAgentById(agentId);
    if (agent) {
      setCurrentAgent(agent);
      // Reset selected neighborhood when changing agent
      setSelectedNeighborhood(null);
    }
  };

  // Get all properties for the current agent
  const agentProperties = getActivePropertiesByAgent(currentAgent.id);

  return {
    properties,
    neighborhoods,
    agents,
    currentAgent,
    selectedNeighborhood,
    filteredProperties,
    agentNeighborhoods,
    soldProperties,
    agentReviews,
    selectNeighborhood,
    selectAgent,
    getPropertyById,
    getAgentById,
    getNeighborhoodById,
    getPropertiesByNeighborhood,
    agentProperties,
    calculateAverageRating,
  };
}
