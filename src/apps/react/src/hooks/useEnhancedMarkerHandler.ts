import { useState, useCallback, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";

interface UseEnhancedMarkerHandlerProps {
  onPositionChange: (position: { yaw: number; pitch: number }) => void;
  initialPosition?: { yaw: number; pitch: number };
}

export function useEnhancedMarkerHandler({ onPositionChange, initialPosition }: UseEnhancedMarkerHandlerProps) {
  const [hasMarker, setHasMarker] = useState(!!initialPosition);
  const [positioningMode, setPositioningMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const temporaryMarkerId = "temp-marker";
    // Use a ref to store position to avoid state updates triggering rerenders
  const lastPosition = useRef<{ yaw: number; pitch: number } | null>(initialPosition || null);

  const getEnhancedMarkerHtml = useCallback(() => {
    return `
      <div class="marker-container" style="
        position: relative;
        cursor: grab;
        user-select: none;
      ">
        <!-- Marker Pin -->
        <div style="
          width: 2px;
          height: 30px;
          background: linear-gradient(to bottom, #dc2626, transparent);
          margin: 0 auto;
        "></div>
        
        <!-- Marker Head -->
        <div style="
          width: 20px;
          height: 20px;
          background: #dc2626;
          border: 2px solid white;
          border-radius: 50%;
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        "></div>
      </div>
    `;
  }, []);

  // Function to set up the initial marker when viewer is ready
  const setupInitialMarker = useCallback((markersPlugin: MarkersPlugin) => {
    if (initialPosition && !markersPlugin.getMarkers().some(marker => marker.id === temporaryMarkerId)) {
      console.log("Setting up initial marker at position:", initialPosition);
      try {
        markersPlugin.addMarker({
          id: temporaryMarkerId,
          position: initialPosition,
          html: getEnhancedMarkerHtml(),
          anchor: 'bottom center',
          data: { draggable: true }
        });
        setHasMarker(true);
        lastPosition.current = initialPosition;
      } catch (error) {
        console.error("Error setting up initial marker:", error);
      }
    }
  }, [initialPosition, getEnhancedMarkerHtml]);

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

      // Add the new marker with enhanced HTML
      markersPlugin.addMarker({
        id: temporaryMarkerId,
        position: position,
        html: getEnhancedMarkerHtml(),
        anchor: 'bottom center',
        data: { draggable: true }
      });

      console.log("Marker added successfully at:", position);
      
      // Update parent component with position
      onPositionChange(position);
      
      // Update local state to indicate we have a marker
      setHasMarker(true);
    } catch (error) {
      console.error("Error handling marker:", error);
    }
  }, [onPositionChange, getEnhancedMarkerHtml]);

  const handleSphereClick = useCallback((
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    e: any,
    markersPlugin: MarkersPlugin
  ) => {
    // Only handle clicks when in positioning mode
    if (!positioningMode) {
      return;
    }

    console.log("Sphere click detected in positioning mode", e);
    
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
    
    // Exit positioning mode after placing marker
    setPositioningMode(false);
  }, [addMarker, positioningMode]);

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
      
      // Exit positioning mode after placing marker
      setPositioningMode(false);
    } catch (error) {
      console.error("Error setting marker at center:", error);
    }
  }, [addMarker]);

  const handleDeleteMarker = useCallback((markersPlugin: MarkersPlugin | null) => {
    if (!markersPlugin) {
      console.warn("Markers plugin not available");
      return;
    }

    try {
      if (markersPlugin.getMarkers().some(marker => marker.id === temporaryMarkerId)) {
        markersPlugin.removeMarker(temporaryMarkerId);
        setHasMarker(false);
        lastPosition.current = null;
        onPositionChange({ yaw: 0, pitch: 0 });
        console.log("Marker deleted");
      }
    } catch (error) {
      console.error("Error deleting marker:", error);
    }
  }, [onPositionChange]);

  const togglePositioningMode = useCallback(() => {
    setPositioningMode(prev => !prev);
  }, []);

  return {
    hasMarker,
    positioningMode,
    isDragging,
    markerPosition: lastPosition.current,
    handleSphereClick,
    handleSetMarkerAtCenter,
    handleDeleteMarker,
    setupInitialMarker,
    togglePositioningMode,
    setIsDragging
  };
}
