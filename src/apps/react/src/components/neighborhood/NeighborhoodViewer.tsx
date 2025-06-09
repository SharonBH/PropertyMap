import React, { useEffect, useRef } from 'react';
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { Card, CardContent } from "@/components/ui/card";
import PropertyCard from "@/components/PropertyCard";
import { NeighborhoodResponse, PropertyResponse } from '@/api/homemapapi';

import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

interface NeighborhoodViewerProps {
  neighborhood: NeighborhoodResponse | null;
  properties: PropertyResponse[];
  selectedProperty: PropertyResponse | null;
  onSelectProperty: (property: PropertyResponse | null) => void;
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

  console.log("properties:", properties);
  console.log("neighborhood:", neighborhood);
  useEffect(() => {
    if (!viewerContainer.current || !neighborhood) return;

    // Use the panorama field from the neighborhood object (extend type if needed)
    const panoramaUrl = (neighborhood as NeighborhoodResponse & { panorama?: string }).panorama || "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg";

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
    console.log("Markers added:", properties[0]?.markerYaw, properties[0]?.markerPitch);

    setTimeout(() => {
      properties.forEach((property) => {
        // fallback for status
        const status = (property as PropertyResponse & { status?: string }).status || 'active';
        // Use markerYaw and markerPitch from the property, fallback to random if missing
        const yaw = typeof property.markerYaw === 'number' ? property.markerYaw : (Math.random() * 2 * Math.PI - Math.PI);
        const pitch = typeof property.markerPitch === 'number' ? property.markerPitch : ((Math.random() * Math.PI - Math.PI/2) * 0.8);
        const markerId = `property-${property.id}`;
        const color = getMarkerColor(status);
        
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
                ${property.name}
              </div>
              <div style="
                background-color: ${color}99;
                padding: 3px 6px;
                border-radius: 3px;
                color: white;
                font-size: 11px;
                white-space: nowrap;
              ">
                ₪${property.askingPrice?.toLocaleString() || '-'}
              </div>
            </div>
          `,
          anchor: 'bottom center',
          tooltip: property.name,
          data: { property }
        });
      });
      if (sphereViewer.current) {
        sphereViewer.current.needsUpdate();
      }
    }, 500);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="w-full h-full relative border border-muted">
      <div ref={viewerContainer} className="w-full h-full"></div>
      
      {selectedProperty && (
        <div className="absolute bottom-4 right-4 w-full max-w-md">
          <Card className="border shadow-lg">
            <CardContent className="p-0">
              <div className="relative">
                <button 
                  className="absolute top-2 right-2 z-10 bg-background/80 p-1 hover:bg-background"
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
