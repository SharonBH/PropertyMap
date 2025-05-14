
import React from "react";
import { Neighborhood } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Map } from "lucide-react";
import { Link } from "react-router-dom";

interface NeighborhoodSelectorProps {
  neighborhoods: Neighborhood[];
  selectedNeighborhood: Neighborhood | null;
  onSelectNeighborhood: (neighborhoodId: string) => void;
}

const NeighborhoodSelector: React.FC<NeighborhoodSelectorProps> = ({
  neighborhoods,
  selectedNeighborhood,
  onSelectNeighborhood,
}) => {
  return (
    <div className="w-full px-4 py-4 mb-8 overflow-x-auto">
      <div className="flex space-x-4 rtl:space-x-reverse">
        {neighborhoods.map((neighborhood) => (
          <div key={neighborhood.id} className="relative">
            <button
              onClick={() => onSelectNeighborhood(neighborhood.id)}
              className={cn(
                "flex items-center min-w-[140px] px-4 py-3 rounded-lg transition-all duration-300 border",
                selectedNeighborhood?.id === neighborhood.id
                  ? "bg-estate-blue text-white border-estate-blue shadow-md"
                  : "bg-white text-estate-dark-gray border-estate-light-gray hover:bg-estate-cream hover:border-estate-sand"
              )}
            >
              <Map className={cn(
                "w-5 h-5 ml-2",
                selectedNeighborhood?.id === neighborhood.id
                  ? "text-white"
                  : "text-estate-blue"
              )} />
              <span className="font-medium">{neighborhood.name}</span>
            </button>
            
            {/* View neighborhood link */}
            <Link 
              to={`/neighborhood/${neighborhood.id}`}
              className="absolute -top-2 -right-2 bg-estate-teal text-white text-xs px-2 py-1 rounded-full hover:bg-estate-dark-teal transition-colors"
            >
              צפה
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeighborhoodSelector;
