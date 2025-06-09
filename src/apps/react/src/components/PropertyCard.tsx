
import React from "react";
import { Link } from "react-router-dom";
import { Property, formatPrice } from "@/lib/data";
import { Bed, Bath, Square, Map, ArrowLeft, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
  isHighlighted?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  isHighlighted = false 
}) => {
  return (
    <div 
      className={cn(
        "property-card bg-white rounded-lg overflow-hidden border border-gray-100",
        isHighlighted ? "ring-2 ring-estate-blue shadow-md" : "hover:shadow-md"
      )}
    >
      <div className="relative">
        <img
          src={property.images && property.images.length > 0 ? property.images[0] : "/placeholder-image.jpg"}
          alt={property.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-0 right-0 m-3">
          <span className="px-3 py-1 text-sm font-bold bg-estate-blue text-white rounded-full">
            {formatPrice(property.price)}
          </span>
        </div>
        {property.status !== "active" && (
          <div className="absolute top-0 left-0 m-3">
            <Badge 
              variant={property.status === "sold" ? "default" : "secondary"}
              className={property.status === "sold" ? "bg-estate-teal" : ""}
            >
              {property.status === "sold" ? "נמכר" : "ממתין"}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-estate-dark-gray mb-1 line-clamp-1">
          {property.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 flex items-center">
          <Map className="w-4 h-4 ml-1 text-estate-blue" />
          {property.address}
        </p>
        
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="w-4 h-4 ml-1 text-estate-teal" />
            <span>{property.bedrooms} חדרים</span>
          </div>
          
          <div className="flex items-center">
            <Bath className="w-4 h-4 ml-1 text-estate-teal" />
            <span>{property.bathrooms} אמבטיות</span>
          </div>
          
          <div className="flex items-center">
            <Square className="w-4 h-4 ml-1 text-estate-teal" />
            <span>{property.size} מ"ר</span>
          </div>
        </div>
        
        <Link 
          to={`/property/${property.id}`}
          className="inline-flex items-center justify-center text-sm text-estate-blue hover:text-estate-teal font-medium transition-colors"
        >
          <span>לפרטים נוספים</span>
          <ArrowLeft className="w-4 h-4 mr-1" />
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
