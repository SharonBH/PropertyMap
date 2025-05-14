
import { useState, useCallback, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { getMarkerHtml } from "@/utils/markerUtils";

interface UseMarkerHandlerProps {
  onPositionChange: (position: { yaw: number; pitch: number }) => void;
}

export function useMarkerHandler({ onPositionChange }: UseMarkerHandlerProps) {
  const [hasMarker, setHasMarker] = useState(false);
  const temporaryMarkerId = "temp-marker";
  
  // Use a ref to store position to avoid state updates triggering rerenders
  const lastPosition = useRef<{ yaw: number; pitch: number } | null>(null);

  const addMarker = useCallback((
    markersPlugin: MarkersPlugin,
    position: { yaw: number; pitch: number }
  ) => {
    try {
      console.log("Adding marker at position:", position);
      
      // Store the position in ref to avoid unnecessary rerenders
      lastPosition.current = position;
      
      // Remove existing marker if it exists
      if (markersPlugin.getMarkers().some(marker => marker.id === temporaryMarkerId)) {
        try {
          console.log("Removing existing marker");
          markersPlugin.removeMarker(temporaryMarkerId);
        } catch (removeError) {
          console.log("Error removing marker:", removeError);
        }
      }

      // Add the new marker - using the spherical coordinates
      markersPlugin.addMarker({
        id: temporaryMarkerId,
        position: position,
        html: getMarkerHtml(),
        anchor: 'bottom center',
      });

      console.log("Marker added successfully at:", position);
      
      // Update parent component with position
      onPositionChange(position);
      
      // Update local state to indicate we have a marker
      setHasMarker(true);
    } catch (error) {
      console.error("Error handling marker:", error);
    }
  }, [onPositionChange]);

  const handleSphereClick = useCallback((
    e: any,
    markersPlugin: MarkersPlugin
  ) => {
    console.log("Sphere click detected", e);
    
    if (!markersPlugin) {
      console.log("Markers plugin not ready yet");
      return;
    }

    // Get the exact coordinates from the click event
    const position = {
      yaw: e.data.yaw,
      pitch: e.data.pitch
    };
    
    console.log("Using marker position from click:", position);
    addMarker(markersPlugin, position);
  }, [addMarker]);

  const handleSetMarkerAtCenter = useCallback((
    viewer: Viewer | null,
    markersPlugin: MarkersPlugin | null
  ) => {
    if (!viewer || !markersPlugin) {
      console.warn("Viewer or markers plugin not available");
      return;
    }

    try {
      // Get current view position - these are spherical coordinates
      const position = viewer.getPosition();
      console.log("Setting marker at current view position:", position);
      
      addMarker(markersPlugin, position);
    } catch (error) {
      console.error("Error setting marker at center:", error);
    }
  }, [addMarker]);

  return {
    hasMarker,
    handleSphereClick,
    handleSetMarkerAtCenter
  };
}
