
import React, { useState, useEffect, useRef } from 'react';
import { Property } from '@/Entities/Property';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Crosshair } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PanoramaViewer from '../components/panorama/PanoramaViewer';
import PropertyCard from '@/components/panorama/PropertyCard';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const markerRefs = useRef(new Map());

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const data = await Property.list();
      setProperties(data);
    } finally {
      setIsLoading(false);
    }
  };

  const panoramaUrl = "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=2000&q=80";

  const updateMarkerPositions = (camera, renderer) => {
    properties.forEach(property => {
      const markerElement = markerRefs.current.get(property.id);
      if (!markerElement) return;

      const pos = property.panorama_position;
      const vector = new THREE.Vector3(pos.x, pos.y, pos.z);
      vector.project(camera);
      
      const widthHalf = renderer.domElement.clientWidth / 2;
      const heightHalf = renderer.domElement.clientHeight / 2;
      
      const x = (vector.x * widthHalf) + widthHalf;
      const y = -(vector.y * heightHalf) + heightHalf;
      
      if (vector.z < 1) {
        markerElement.style.visibility = 'visible';
        markerElement.style.left = `${x}px`;
        markerElement.style.top = `${y}px`;
      } else {
        markerElement.style.visibility = 'hidden';
      }
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="h-screen flex flex-col" dir="rtl">
      {/* Panorama View */}
      <div className="relative h-screen w-full">
        <PanoramaViewer 
          panoramaUrl={panoramaUrl}
          onRender={updateMarkerPositions}
        >
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {properties.map((property) => (
              <div
                key={property.id}
                ref={el => {
                  if (el) {
                    markerRefs.current.set(property.id, el);
                  } else {
                    markerRefs.current.delete(property.id);
                  }
                }}
                className={`absolute transform -translate-x-1/2 pointer-events-auto cursor-pointer transition-all duration-300
                  ${selectedProperty?.id === property.id ? 'z-10' : ''}
                `}
                onClick={() => setSelectedProperty(property)}
              >
                <div className="flex flex-col items-center">
                  {/* Vertical Line */}
                  <div className={`w-[2px] h-20 bg-gradient-to-b from-transparent via-white to-blue-500
                    ${selectedProperty?.id === property.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                  
                  {/* Marker Point */}
                  <div className={`relative -mt-[2px] w-4 h-4 rounded-full bg-blue-500 shadow-lg
                    ${selectedProperty?.id === property.id ? 'scale-125' : 'scale-100 hover:scale-110'}
                    transition-all duration-300`}>
                    <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
                  </div>

                  {/* Label */}
                  <div className={`mt-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg
                    transition-all duration-300 border border-blue-100
                    ${selectedProperty?.id === property.id ? 'scale-105 border-blue-300' : 'hover:scale-105'}`}>
                    <div className="text-sm font-medium text-gray-900 whitespace-nowrap">{property.title}</div>
                    <div className="text-xs font-medium text-blue-600">{formatPrice(property.price)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PanoramaViewer>

        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h1 className="text-lg font-semibold mb-2">צפיין נכסים</h1>
          <p className="text-sm text-gray-600">לחץ על הסמנים לצפייה בנכסים</p>
          
          <Link to={createPageUrl("MarkerPositioner")} className="block mt-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2 w-full">
              <Crosshair className="w-4 h-4" />
              כלי מיקום סמנים
            </Button>
          </Link>
        </div>

        {/* Selected Property Card */}
        {selectedProperty && (
          <div className="absolute bottom-4 right-4 left-4 md:right-4 md:left-auto md:w-96">
            <PropertyCard
              property={selectedProperty}
              isActive={true}
              showDetailsLink={true}
              onClose={() => setSelectedProperty(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
