import { Neighborhood, Property, Review } from "@/lib/data";
import { NeighborhoodResponse, PropertyResponse, ReviewResponse } from "@/api/homemapapi";

export function mapNeighborhood(n: NeighborhoodResponse): Neighborhood {
  return {
    id: n.id || "",
    name: n.name || "",
    description: n.description || "",
    coordinates: { lat: 0, lng: 0 }, // No coordinates in API, fallback
    zoom: 15, // Default zoom
  };
}

export function mapProperty(p: PropertyResponse): Property {
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

export function mapReview(r: ReviewResponse): Review {
  return {
    id: r.id || "",
    agentId: "", // Not in API response
    clientName: r.reviewer || "", // reviewer as clientName
    rating: r.score || 0,
    comment: r.content || "",
    propertyId: undefined, // Not in API response
    createdAt: r.reviewDate || "",
  };
}
