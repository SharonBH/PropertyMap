import { useRef, useCallback, useEffect, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { useMarkerHandler } from "./useMarkerHandler";
import { NeighborhoodResponse } from "@/api/homemapapi";
import { resolveNeighborhoodUrl } from "@/lib/imageUrl";

interface UseMarkerPositionerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  neighborhood: NeighborhoodResponse;
  markerPosition: { yaw: number; pitch: number };
  onPositionChange: (position: { yaw: number; pitch: number }) => void;
}

export function useMarkerPositioner({
  containerRef,
  neighborhood,
  markerPosition,
  onPositionChange
}: UseMarkerPositionerProps) {
  const viewer = useRef<Viewer | null>(null);
  const markersPlugin = useRef<MarkersPlugin | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  // Track if event handlers have been attached
  const eventHandlersSet = useRef(false);

  const { hasMarker, handleSphereClick, handleSetMarkerAtCenter } = useMarkerHandler({
    onPositionChange
  });

  // Initialize the viewer when the neighborhood or container changes
  useEffect(() => {
    if (!containerRef.current || !neighborhood) return;

    // Clean up previous viewer if it exists
    if (viewer.current) {
      viewer.current.destroy();
      viewer.current = null;
      markersPlugin.current = null;
      setViewerReady(false);
      eventHandlersSet.current = false;
    }

    // Use the sphere image from the API-provided neighborhood object
    const panoramaUrl = resolveNeighborhoodUrl(neighborhood.sphereImgURL);
    if (!panoramaUrl) {
      console.error("No panorama image URL found for neighborhood", neighborhood);
      return;
    }

    const newViewer = new Viewer({
      container: containerRef.current,
      panorama: panoramaUrl,
      caption: `Click anywhere to position the marker in ${neighborhood.name}`,
      navbar: ['zoom', 'fullscreen'],
      defaultYaw: 0,
      defaultPitch: 0,
      plugins: [
        [MarkersPlugin, { markers: [] }]
      ]
    });
    viewer.current = newViewer;
    const newMarkersPlugin = newViewer.getPlugin(MarkersPlugin) as MarkersPlugin;
    markersPlugin.current = newMarkersPlugin;

    newViewer.addEventListener('ready', () => {
      setViewerReady(true);
    });

    // Set up click event handler
    if (!eventHandlersSet.current && newViewer && newMarkersPlugin) {
      // Dynamically inspect the event object to ensure compatibility
      const clickHandler = (e: unknown) => {
        if (typeof e === 'object' && e !== null && 'position' in e) {
          const event = e as { position: { yaw: number; pitch: number } };
          if (markersPlugin.current) {
            markersPlugin.current.clearMarkers();
            markersPlugin.current.addMarker({
              id: "marker",
              position: event.position,
              html: `
                <div style="
                  transform: translate(-50%, -100%);
                  text-align: center;
                ">
                  <div style="
                    background-color: #2DC7FF;
                    padding: 6px 10px;
                    border-radius: 4px;
                    color: white;
                    font-size: 13px;
                    font-weight: bold;
                    white-space: nowrap;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    margin-bottom: 4px;
                  ">
                    מיקום הנכס
                  </div>
                </div>
              `,
              anchor: "bottom center",
              tooltip: "מיקום הנכס"
            });
          }
          onPositionChange(event.position);
        } else {
          console.warn("Unexpected event structure", e);
        }
      };
      newViewer.addEventListener('click', clickHandler);
      eventHandlersSet.current = true;
    }

    // Clean up function
    return () => {
      if (viewer.current) {
        viewer.current.destroy();
        viewer.current = null;
        markersPlugin.current = null;
        setViewerReady(false);
        eventHandlersSet.current = false;
      }
    };
  }, [containerRef, neighborhood, handleSphereClick, onPositionChange]);

  // Add logic to display the current property marker on the sphere
  useEffect(() => {
    if (viewer.current && markersPlugin.current) {
      const { yaw, pitch } = markerPosition || { yaw: 0, pitch: 0 };
      console.log('[MarkerPositioner] markerPosition:', markerPosition, 'yaw:', yaw, 'pitch:', pitch);
      // Always clear markers first
      markersPlugin.current.clearMarkers();
      // Add marker if markerPosition is defined (even if yaw/pitch are small values)
      // Add extra debug log for plugin state
      console.log('[MarkerPositioner] markersPlugin.current:', markersPlugin.current);
      try {
        markersPlugin.current.addMarker({
          id: "current-marker",
          position: { yaw, pitch },
          html: `<div style="width:32px;height:32px;background:red;border-radius:50%;border:2px solid white;box-shadow:0 0 8px #000;z-index:9999;"></div>`,
          anchor: "bottom center",
          tooltip: "מיקום הנכס"
        });
        console.log('[MarkerPositioner] Marker added at:', { yaw, pitch });
      } catch (err) {
        console.error('[MarkerPositioner] Error adding marker:', err);
      }
    } else {
      console.log('[MarkerPositioner] Viewer or markersPlugin not ready');
    }
  }, [markerPosition]);

  const handleSetMarkerAtCenterWrapper = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (viewer.current && markersPlugin.current) {
      handleSetMarkerAtCenter(viewer.current, markersPlugin.current);
    } else {
      console.warn("Viewer or markersPlugin not available");
    }
  }, [handleSetMarkerAtCenter]);

  return {
    viewerReady,
    hasMarker,
    handleSetMarkerAtCenter: handleSetMarkerAtCenterWrapper
  };
}
