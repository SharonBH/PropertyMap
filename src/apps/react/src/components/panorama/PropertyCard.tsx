import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Bed, Bath, Ruler, ArrowLeft, X } from "lucide-react";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PropertyCard({ property, isActive, showDetailsLink = false, onClose }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const propertyTypes = {
    house: "בית",
    apartment: "דירה",
    condo: "קונדו",
    land: "מגרש"
  };

  return (
    <Card className={`transition-all duration-300 ${
      isActive ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
    }`}>
      <div className="aspect-video w-full overflow-hidden rounded-t-lg relative">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{property.title}</h3>
            <p className="text-sm text-gray-500">{property.address}</p>
          </div>
          <Badge variant="secondary" className="capitalize">
            {propertyTypes[property.type] || property.type}
          </Badge>
        </div>
        <div className="text-2xl font-bold text-blue-600 mt-2">
          {formatPrice(property.price)}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} חדרים</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} חדרי רחצה</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              <span>{property.area} מ"ר</span>
            </div>
          )}
        </div>
      </CardContent>
      {showDetailsLink && (
        <CardFooter className="p-4 pt-0">
          <Link 
            to={createPageUrl(`PropertyDetails?id=${property.id}`)} 
            className="w-full"
          >
            <Button className="w-full" variant="default">
              לפרטים נוספים
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}