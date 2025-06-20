import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import {
  NeighborhoodResponse,
  PropertyResponse,
  ReviewResponse,
  searchPropertiesEndpoint,
  searchReviewsEndpoint,
  getPropertyEndpoint,
} from "@/api/homemapapi";

export function useProperties() {
  const {currentAgent } = useAuth();
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodResponse | null>(null);
  const [filteredProperties, setFilteredProperties] = useState<PropertyResponse[]>([]);
  const [agentNeighborhoods, setAgentNeighborhoods] = useState<NeighborhoodResponse[]>([]);
  const [soldProperties, setSoldProperties] = useState<PropertyResponse[]>([]);
  const [agentReviews, setAgentReviews] = useState<ReviewResponse[]>([]);
  const [allProperties, setAllProperties] = useState<PropertyResponse[]>([]);

  // Fetch neighborhoods for the agent (from agent.neighborhoods)
  useEffect(() => {
    if (currentAgent && currentAgent.neighborhoods) {
      setAgentNeighborhoods(currentAgent.neighborhoods);
      if (currentAgent.neighborhoods.length > 0 && !selectedNeighborhood) {
        setSelectedNeighborhood(currentAgent.neighborhoods[0]);
      }
    }
  }, [currentAgent, selectedNeighborhood]);

  // Fetch all properties for the agent's agency
  useEffect(() => {
    async function fetchProperties() {
      if (currentAgent?.agency?.id) {
        const res = await searchPropertiesEndpoint({
          advancedFilter: {
            field: "agencyId",
            operator: "eq",
            value: currentAgent.agency.id,
          },
          pageNumber: 1,
          pageSize: 100,
        });
        setAllProperties(res.items || []);
      } else {
        setAllProperties([]);
      }
    }
    fetchProperties();
  }, [currentAgent]);

  // Fetch all reviews for the agent's agency
  useEffect(() => {
    async function fetchReviews() {
      if (currentAgent?.agency?.id) {
        const res = await searchReviewsEndpoint({
          advancedFilter: {
            field: "agencyId",
            operator: "eq",
            value: currentAgent.agency.id,
          },
          pageNumber: 1,
          pageSize: 100,
        });
        setAgentReviews(res.items || []);
      } else {
        setAgentReviews([]);
      }
    }
    fetchReviews();
  }, [currentAgent]);

  // Fetch properties by neighborhoodId
  const fetchPropertiesByNeighborhoodId = async (neighborhoodId: string) => {
    if (!neighborhoodId) {
      setFilteredProperties([]);
      return;
    }
    const res = await searchPropertiesEndpoint({
      advancedFilter: {
        field: "neighborhoodId",
        operator: "eq",
        value: neighborhoodId,
      },
      pageNumber: 1,
      pageSize: 100,
    });
    setFilteredProperties(res.items || []);
  };

  // Update filtered properties when selected neighborhood changes (fetch from API)
  useEffect(() => {
    if (selectedNeighborhood) {
      fetchPropertiesByNeighborhoodId(selectedNeighborhood.id);
    } else {
      setFilteredProperties([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNeighborhood]);

  // Update sold properties when allProperties changes
  useEffect(() => {
    const soldProps = allProperties.filter(
      (prop: PropertyResponse) => prop.soldDate != null
    );
    setSoldProperties(soldProps);
  }, [allProperties]);

  const selectNeighborhood = (neighborhoodId: string) => {
    const neighborhood = agentNeighborhoods.find((n) => n.id === neighborhoodId);
    setSelectedNeighborhood(neighborhood || null);
  };

  // Get all active properties for the current agent's agency
  const agentProperties = allProperties.filter(
    (prop: PropertyResponse) => !prop.soldDate
  );

  // Calculate average rating using review scores
  const calculateAverageRating = () => {
    if (!agentReviews.length) return 0;
    const total = agentReviews.reduce((sum, review) => sum + (review.score || 0), 0);
    return total / agentReviews.length;
  };

  // Get property by id, first from state, then from API if not found
  const getPropertyById = async (id: string): Promise<PropertyResponse | null> => {
    let property = allProperties.find((p) => p.id === id);
    console.log("getPropertyById", id, property);
    if (property) return property;
    try {
      const result = await getPropertyEndpoint(id, "1");
      console.log("getPropertyById result", result);
      return result as PropertyResponse;
    } catch {
      return null;
    }
  };

  return {
    currentAgent,
    selectedNeighborhood,
    filteredProperties,
    agentNeighborhoods,
    soldProperties,
    agentReviews,
    selectNeighborhood,
    agentProperties,
    calculateAverageRating,
    getPropertyById,
  };
}
