
import React from "react";
import { Search } from "lucide-react";
import { Neighborhood } from "@/lib/data";

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedNeighborhood: string;
  setSelectedNeighborhood: (id: string) => void;
  availableNeighborhoods: Neighborhood[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  selectedNeighborhood,
  setSelectedNeighborhood,
  availableNeighborhoods,
}) => {
  return (
    <div className="p-6 border-b">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="חפש לפי כותרת או כתובת..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-estate-teal focus:border-transparent transition-all"
          />
        </div>
        
        <div className="w-full md:w-64">
          <select
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-estate-teal focus:border-transparent transition-all"
          >
            <option value="">כל השכונות</option>
            {availableNeighborhoods.map((neighborhood) => (
              <option key={neighborhood.id} value={neighborhood.id}>
                {neighborhood.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
