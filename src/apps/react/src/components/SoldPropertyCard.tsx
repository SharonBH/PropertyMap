import React from "react";
import { formatPrice, formatDate } from "@/lib/data";
import { PropertyResponse } from "@/api/homemapapi";
import { Tag, CheckCircle, Bed, Bath, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SoldPropertyCardProps {
  property: PropertyResponse;
}

function getMainImage(images?: { imageUrl?: string | null; isMain?: boolean }[] | null) {
  if (!images || images.length === 0) return '/placeholder-image.jpg';
  const main = images.find(img => img.isMain);
  return (main?.imageUrl ?? images[0].imageUrl) || '/placeholder-image.jpg';
}

const SoldPropertyCard: React.FC<SoldPropertyCardProps> = ({ property }) => {
  const priceDifference = property.soldPrice && property.askingPrice
    ? property.soldPrice - property.askingPrice
    : 0;
  const priceDifferencePercentage = property.askingPrice
    ? (priceDifference / property.askingPrice) * 100
    : 0;

  const imageUrl = getMainImage(property.images);

  return (
    <Card className="overflow-hidden border border-gray-100 transition-all hover:shadow-md">
      <div className="relative">
        <img
          src={imageUrl}
          alt={property.name}
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
          {property.name}
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
            <span>{formatPrice(property.askingPrice || 0)}</span>
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
            <span>{property.rooms}</span>
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
