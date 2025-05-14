
import React, { useEffect, useRef } from 'react';
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { Card, CardContent } from "@/components/ui/card";
import PropertyCard from "@/components/PropertyCard";
import { Neighborhood, Property } from '@/lib/data';

import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

interface NeighborhoodViewerProps {
  neighborhood: Neighborhood | null;
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property | null) => void;
}

const NeighborhoodViewer: React.FC<NeighborhoodViewerProps> = ({
  neighborhood,
  properties,
  selectedProperty,
  onSelectProperty
}) => {
  const viewerContainer = useRef<HTMLDivElement>(null);
  const sphereViewer = useRef<Viewer | null>(null);
  const markersPlugin = useRef<MarkersPlugin | null>(null);

  useEffect(() => {
    if (!viewerContainer.current || !neighborhood) return;
    
    const panoramaUrls: Record<string, string> = {
      n1: "/assets/16.jpg",
      n2: "https://photo-sphere-viewer-data.netlify.app/assets/sphere-small.jpg",
      n3: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg",
      n4: "https://photo-sphere-viewer-data.netlify.app/assets/sphere-small.jpg",
      n5: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg",
      n6: "https://photo-sphere-viewer-data.netlify.app/assets/sphere-small.jpg",
      n7: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg",
    };
    
    const panoramaUrl = panoramaUrls[neighborhood.id] || 
      "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg";
    
    if (sphereViewer.current) {
      sphereViewer.current.destroy();
    }
    
    sphereViewer.current = new Viewer({
      container: viewerContainer.current,
      panorama: panoramaUrl,
      caption: neighborhood.name,
      navbar: ['zoom', 'fullscreen'],
      defaultYaw: 0,
      defaultPitch: 0,
      plugins: [[MarkersPlugin, {}]]
    });
    
    markersPlugin.current = sphereViewer.current.getPlugin(MarkersPlugin);
    
    return () => {
      if (sphereViewer.current) {
        sphereViewer.current.destroy();
        sphereViewer.current = null;
        markersPlugin.current = null;
      }
    };
  }, [neighborhood]);

  useEffect(() => {
    if (!markersPlugin.current || !properties.length || !sphereViewer.current) return;
    
    const getMarkerColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'active':
          return '#2DC7FF';
        case 'pending':
          return '#F4D06F';
        case 'sold':
          return '#ea384c';
        default:
          return '#2DC7FF';
      }
    };

    markersPlugin.current.clearMarkers();
    
    setTimeout(() => {
      properties.forEach((property) => {
        const yaw = Math.random() * 2 * Math.PI - Math.PI;
        const pitch = (Math.random() * Math.PI - Math.PI/2) * 0.8;
        
        const markerId = `property-${property.id}`;
        const color = getMarkerColor(property.status);
        
        markersPlugin.current?.addMarker({
          id: `${markerId}-line`,
          position: { yaw, pitch },
          html: `
            <div style="
              width: 2px;
              height: 40px;
              background: linear-gradient(to bottom, ${color}, transparent);
              transform: translateX(-50%);
            "></div>
          `,
          anchor: 'bottom center',
          data: { property }
        });

        markersPlugin.current?.addMarker({
          id: markerId,
          position: { yaw, pitch },
          html: `
            <div style="
              transform: translate(-50%, -100%);
              text-align: center;
            ">
              <div style="
                background-color: ${color};
                padding: 6px 10px;
                border-radius: 4px;
                color: white;
                font-size: 13px;
                font-weight: bold;
                white-space: nowrap;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                margin-bottom: 4px;
              ">
                ${property.title}
              </div>
              <div style="
                background-color: ${color}99;
                padding: 3px 6px;
                border-radius: 3px;
                color: white;
                font-size: 11px;
                white-space: nowrap;
              ">
                ₪${property.price.toLocaleString()}
              </div>
            </div>
          `,
          anchor: 'bottom center',
          tooltip: property.title,
          data: { property }
        });
      });
      
      if (sphereViewer.current) {
        sphereViewer.current.needsUpdate();
      }
    }, 500);
    
    const handleMarkerClick = (e: any) => {
      if (e.marker.data?.property) {
        onSelectProperty(e.marker.data.property);
      }
    };
    
    markersPlugin.current.addEventListener('select-marker', handleMarkerClick);
    
    return () => {
      if (markersPlugin.current) {
        markersPlugin.current.removeEventListener('select-marker', handleMarkerClick);
      }
    };
  }, [properties, onSelectProperty]);

  return (
    <div className="w-full h-[70vh] relative mb-8 rounded-lg overflow-hidden border border-muted">
      <div ref={viewerContainer} className="w-full h-full"></div>
      
      {selectedProperty && (
        <div className="absolute bottom-4 right-4 w-full max-w-md">
          <Card className="border shadow-lg">
            <CardContent className="p-0">
              <div className="relative">
                <button 
                  className="absolute top-2 right-2 z-10 bg-background/80 rounded-full p-1 hover:bg-background"
                  onClick={() => onSelectProperty(null)}
                >
                  ✕
                </button>
                <PropertyCard property={selectedProperty} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NeighborhoodViewer;
