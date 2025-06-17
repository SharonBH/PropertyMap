import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PropertyResponse, searchPropertyTypesEndpoint, searchPropertyStatusesEndpoint, PropertyTypeResponse, PropertyStatusResponse } from "@/api/homemapapi";
import { Bed, Bath, Square, Map, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { resolveImageUrl } from "@/lib/imageUrl";

interface PropertyCardProps {
  property: PropertyResponse;
  isHighlighted?: boolean;
}

function getMainImage(images?: { imageUrl?: string | null; isMain?: boolean }[] | null) {
  if (!images || images.length === 0) return '/placeholder-image.jpg';
  const main = images.find(img => img.isMain);
  return resolveImageUrl(main?.imageUrl ?? images[0].imageUrl);
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  isHighlighted = false 
}) => {
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeResponse[]>([]);
  const [propertyStatuses, setPropertyStatuses] = useState<PropertyStatusResponse[]>([]);

  useEffect(() => {
    searchPropertyTypesEndpoint({ pageNumber: 1, pageSize: 100 }, "1").then(res => setPropertyTypes(res.items || []));
    searchPropertyStatusesEndpoint({ pageNumber: 1, pageSize: 100 }, "1").then(res => setPropertyStatuses(res.items || []));
  }, []);

  const propertyType = propertyTypes.find(t => t.id === property.propertyTypeId);
  const propertyStatus = propertyStatuses.find(s => s.id === property.propertyStatusId);
  const formatPrice = (price?: number | null) => price ? price.toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }) : "-";

  const imageUrl = getMainImage(property.images);

  return (
    <div 
      className={cn(
        "property-card bg-white rounded-lg overflow-hidden border border-gray-100",
        isHighlighted ? "ring-2 ring-estate-blue shadow-md" : "hover:shadow-md"
      )}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={property.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-0 right-0 m-3">
          <span className="px-3 py-1 text-sm font-bold bg-estate-blue text-white rounded-full">
            {formatPrice(property.askingPrice)}
          </span>
        </div>
        {propertyStatus && propertyStatus.name !== "active" && (
          <div className="absolute top-0 left-0 m-3">
            <Badge 
              variant={propertyStatus.name === "sold" ? "default" : "secondary"}
              className={propertyStatus.name === "sold" ? "bg-estate-teal" : ""}
            >
              {propertyStatus.name === "sold" ? "נמכר" : propertyStatus.name}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-estate-dark-gray mb-1 line-clamp-1">
          {property.name}
        </h3>
        <div className="flex gap-2 mb-2">
          {propertyType && (
            <span className="text-xs bg-estate-blue/10 text-estate-blue px-2 py-0.5 rounded-full">
              {propertyType.name}
            </span>
          )}
          {propertyStatus && (
            <span className="text-xs bg-estate-teal/10 text-estate-teal px-2 py-0.5 rounded-full">
              {propertyStatus.name}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-3 flex items-center">
          <Map className="w-4 h-4 ml-1 text-estate-blue" />
          {property.address}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="w-4 h-4 ml-1 text-estate-teal" />
            <span>{property.rooms} חדרים</span>
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
