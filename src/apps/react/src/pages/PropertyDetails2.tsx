import React, { useState, useEffect } from 'react';
import { Property } from '@/entities/Property';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Bed, Bath, Ruler, Home, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PropertyDetailsPage() {
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperty();
  }, []);

  const loadProperty = async () => {
    setIsLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const propertyId = urlParams.get('id');
      
      if (!propertyId) {
        navigate(createPageUrl('Properties'));
        return;
      }
      
      const properties = await Property.list();
      const foundProperty = properties.find(p => p.id === propertyId);
      
      if (foundProperty) {
        setProperty(foundProperty);
      } else {
        navigate(createPageUrl('Properties'));
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-xl mb-4">הנכס לא נמצא</p>
        <Link to={createPageUrl('Properties')}>
          <Button>חזרה לרשימת הנכסים</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to={createPageUrl('Properties')}>
            <Button variant="ghost" className="gap-2">
              <ArrowRight className="w-4 h-4" />
              חזרה למפת הנכסים
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="h-64 sm:h-80 md:h-96 w-full relative">
            <img 
              src={property.image_url} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Property Content */}
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {propertyTypes[property.type] || property.type}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-600 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>{property.address}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-3xl font-bold text-blue-600">
                  {formatPrice(property.price)}
                </div>
              </div>
            </div>
            
            {/* Property Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-b">
              {property.bedrooms && (
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Bed className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">חדרים</p>
                    <p className="text-lg font-semibold">{property.bedrooms}</p>
                  </div>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Bath className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">חדרי רחצה</p>
                    <p className="text-lg font-semibold">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              
              {property.area && (
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Ruler className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">שטח</p>
                    <p className="text-lg font-semibold">{property.area} מ"ר</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">תיאור הנכס</h2>
              <p className="text-gray-600">
                נכס מרהיב עם מפרט טכני גבוה במיקום מצוין. הנכס מתאים למשפחות ומציע נוחות ופרטיות.
                מרווח ומוקף בסביבה ירוקה, עם גישה נוחה לתחבורה ציבורית ומרכזי קניות.
              </p>
            </div>
            
            {/* CTA Button */}
            <div className="mt-8">
              <Button className="w-full md:w-auto text-lg py-6" size="lg">
                <DollarSign className="w-5 h-5 mr-2" />
                צור קשר לגבי נכס זה
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}