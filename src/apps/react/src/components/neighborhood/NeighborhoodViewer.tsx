import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { Card, CardContent } from "@/components/ui/card";
import PropertyCard from "@/components/PropertyCard";
import { NeighborhoodResponse, PropertyResponse, searchPropertyStatusesEndpoint, PropertyStatusResponse } from '@/api/homemapapi';

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
  const onSelectPropertyRef = useRef(onSelectProperty);
  const markersInitializedRef = useRef(false);
  const [propertyStatuses, setPropertyStatuses] = useState<PropertyStatusResponse[]>([]);

  // Fetch property statuses on component mount
  useEffect(() => {
    searchPropertyStatusesEndpoint({ pageNumber: 1, pageSize: 100 }, "1")
      .then(res => setPropertyStatuses(res.items || []));
  }, []);

  // Update the ref when the callback changes
  useEffect(() => {
    onSelectPropertyRef.current = onSelectProperty;
  }, [onSelectProperty]);  // Memoize properties to prevent unnecessary recalculations
  const memoizedProperties = useMemo(() => properties, [properties]);

  console.log("properties:", properties);
  console.log("neighborhood:", neighborhood);
  useEffect(() => {
    if (!viewerContainer.current || !neighborhood) return;

    // Use the panorama field from the neighborhood object (extend type if needed)
    const panoramaUrl = (neighborhood as NeighborhoodResponse & { panorama?: string }).panorama || "/assets/16.jpg";

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
    if (!markersPlugin.current || !memoizedProperties.length || !sphereViewer.current || !propertyStatuses.length) return;

    // Don't recreate markers if they're already initialized and properties haven't changed
    if (markersInitializedRef.current) return;

    const getMarkerColor = (propertyStatusId: string) => {
      const status = propertyStatuses.find(s => s.id === propertyStatusId);
      const statusName = status?.name?.toLowerCase() || 'active';
      
      console.log("getMarkerColor called with statusId:", propertyStatusId, "statusName:", statusName);
      switch (statusName) {
        case 'active':
        case 'פעיל':
          return '#2DC7FF';
        case 'pending':
        case 'ממתין':
          return '#F4D06F';
        case 'sold':
        case 'נמכר':
          return '#ea384c';
        default:
          return '#2DC7FF';
      }
    };

    markersPlugin.current.clearMarkers();
    console.log("Markers added:", memoizedProperties[0]?.markerYaw, memoizedProperties[0]?.markerPitch);

    memoizedProperties.forEach((property) => {
      // Use the proper propertyStatusId field
      const propertyStatusId = property.propertyStatusId || '';
      // Use markerYaw and markerPitch from the property, fallback to random if missing
      const yaw = typeof property.markerYaw === 'number' ? property.markerYaw : (Math.random() * 2 * Math.PI - Math.PI);
      const pitch = typeof property.markerPitch === 'number' ? property.markerPitch : ((Math.random() * Math.PI - Math.PI/2) * 0.8);
      const markerId = `property-${property.id}`;
      const color = getMarkerColor(propertyStatusId);
      
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

    markersInitializedRef.current = true;

    if (sphereViewer.current) {
      sphereViewer.current.needsUpdate();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMarkerClick = (e: any) => {
      if (e.marker.data?.property) {
        onSelectPropertyRef.current(e.marker.data.property);
      }
    };

    markersPlugin.current.addEventListener('select-marker', handleMarkerClick);

    return () => {
      if (markersPlugin.current) {
        markersPlugin.current.removeEventListener('select-marker', handleMarkerClick);
        markersInitializedRef.current = false;
      }
    };
  }, [memoizedProperties, propertyStatuses]);

  return (
    <div className="w-full h-full relative border border-muted">
      <div ref={viewerContainer} className="w-full h-full"></div>
      
      {selectedProperty && (
        <div className="absolute bottom-4 right-4 w-full max-w-md z-50">
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
