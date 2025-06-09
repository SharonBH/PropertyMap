import { AgencyResponse, NeighborhoodResponse } from "@/api/homemapapi";


export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  neighborhoods: NeighborhoodResponse[];
  overallRating?: number;
  agency: AgencyResponse; // Added agency field
}


// Format price to Israeli shekel
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(price);
};

// Format date to Hebrew format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Get neighborhood by ID
/* export const getNeighborhoodById = (id: string): Neighborhood | undefined => {
  return neighborhoods.find((n) => n.id === id);
}; */

// Get agent by ID
/* export const getAgentById = (id: string): Agent | undefined => {
  return agents.find((a) => a.id === id);
}; */


// Get reviews by agent
/* export const getReviewsByAgent = (agentId: string): ReviewResponse[] => {
  return ReviewResponse.filter((r) => r.agentId === agentId);
}; */

// Calculate average rating for an agent
/* export const calculateAverageRating = (agentId: string): number => {
  const agentReviews = getReviewsByAgent(agentId);
  if (agentReviews.length === 0) return 0;
  
  const totalRating = agentReviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((totalRating / agentReviews.length).toFixed(1));
}; */
