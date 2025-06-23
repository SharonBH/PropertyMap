import { useState } from 'react';
import { searchAgenciesEndpoint, AgencyResponse } from "@/api/homemapapi";

export function useAgency() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetches an agency by tenant ID or gets the first available agency
   * 
   * @param tenantId Optional tenant ID to filter by
   * @returns The fetched agency or null if none found
   */
  const fetchAgencyByTenant = async (tenantId?: string): Promise<AgencyResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      // Prepare filters if tenantId is provided
      const filters = tenantId ? { filters: { tenantId } } : {};
      
      const agenciesResponse = await searchAgenciesEndpoint({
        pageNumber: 1,
        pageSize: 1,
        ...filters
        // You can add more specific filters here if needed
      }, "1"); // Using API version 1
      
      if (agenciesResponse && agenciesResponse.items && agenciesResponse.items.length > 0) {
        return agenciesResponse.items[0];
      }
      
      return null;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch agency');
      setError(error);
      console.error("Error fetching agency:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates a fallback agency object if no agency is found
   * 
   * @param tenantId The tenant ID to use for the fallback agency
   * @returns A fallback agency object
   */
  const createFallbackAgency = (tenantId: string): AgencyResponse => {
    return {
      id: tenantId,
      name: `Agency ${tenantId}`,
      description: "",
      email: "",
      telephone: "",
      address: "",
      logoURL: "",
      primaryColor: ""
    };
  };

  return {
    fetchAgencyByTenant,
    createFallbackAgency,
    loading,
    error
  };
}
