
import React from "react";
import { Property, formatPrice, formatDate } from "@/lib/data";
import { Tag, CheckCircle, Bed, Bath, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SoldPropertyCardProps {
  property: Property;
}

const SoldPropertyCard: React.FC<SoldPropertyCardProps> = ({ property }) => {
  const priceDifference = property.soldPrice && property.price 
    ? property.soldPrice - property.price
    : 0;
  
  const priceDifferencePercentage = property.price 
    ? (priceDifference / property.price) * 100
    : 0;

  return (
    <Card className="overflow-hidden border border-gray-100 transition-all hover:shadow-md">
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-0 right-0 m-3">
          <Badge variant="default" className="bg-estate-teal text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            נמכר
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <h3 className="text-lg font-bold text-estate-dark-gray mb-1 line-clamp-1">
          {property.title}
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          {property.address}
        </p>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-center mb-3">
          <div className="text-estate-dark-gray font-semibold">
            <div className="flex items-center">
              <Tag className="w-4 h-4 ml-1 text-estate-teal" />
              <span className="text-xs">מחיר מקורי:</span>
            </div>
            <span>{formatPrice(property.price)}</span>
          </div>
          
          <div className="text-estate-dark-gray font-semibold">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 ml-1 text-estate-teal" />
              <span className="text-xs">מחיר מכירה:</span>
            </div>
            <span>{formatPrice(property.soldPrice || 0)}</span>
          </div>
        </div>
        
        <div className={cn(
          "text-sm text-center p-1 rounded-md mb-3 font-medium",
          priceDifference >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          <span>
            {priceDifference >= 0 ? "+" : ""}
            {formatPrice(priceDifference)} ({priceDifferencePercentage.toFixed(1)}%)
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Bed className="w-4 h-4 ml-1 text-estate-teal" />
            <span>{property.bedrooms}</span>
          </div>
          
          <div className="flex items-center">
            <Bath className="w-4 h-4 ml-1 text-estate-teal" />
            <span>{property.bathrooms}</span>
          </div>
          
          <div className="flex items-center">
            <Square className="w-4 h-4 ml-1 text-estate-teal" />
            <span>{property.size} מ"ר</span>
          </div>
        </div>
        
        {property.soldDate && (
          <div className="text-sm text-gray-600 text-center border-t pt-2">
            <span>נמכר בתאריך: {formatDate(property.soldDate)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SoldPropertyCard;
