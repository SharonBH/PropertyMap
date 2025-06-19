import { useRef, useCallback, useEffect } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { useViewerInitializer } from "./useViewerInitializer";
import { useEnhancedMarkerHandler } from "./useEnhancedMarkerHandler";
import { NeighborhoodResponse } from "@/api/homemapapi";

interface UseEnhancedMarkerPositionerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  neighborhood: NeighborhoodResponse;
  onPositionChange: (position: { yaw: number; pitch: number }) => void;
  initialPosition?: { yaw: number; pitch: number };
}

export function useEnhancedMarkerPositioner({
  containerRef,
  neighborhood,
  onPositionChange,
  initialPosition
}: UseEnhancedMarkerPositionerProps) {
  const viewer = useRef<Viewer | null>(null);
  const markersPlugin = useRef<MarkersPlugin | null>(null);
  // Track if event handlers have been attached
  const eventHandlersSet = useRef(false);
  
  const { 
    hasMarker, 
    positioningMode, 
    isDragging, 
    markerPosition,
    handleSphereClick, 
    handleSetMarkerAtCenter, 
    handleDeleteMarker,
    setupInitialMarker,
    togglePositioningMode,
    setIsDragging
  } = useEnhancedMarkerHandler({
    onPositionChange,
    initialPosition
  });

  const handleViewerReady = useCallback((newViewer: Viewer, newMarkersPlugin: MarkersPlugin) => {
    console.log("Enhanced viewer ready callback fired");
    viewer.current = newViewer;
    markersPlugin.current = newMarkersPlugin;
    
    // Set up initial marker if provided
    setupInitialMarker(newMarkersPlugin);
    
    // Only set up event handlers once per viewer instance
    if (!eventHandlersSet.current && newViewer && newMarkersPlugin) {
      console.log("Setting up enhanced click event handlers");
      
      eventHandlersSet.current = true;
      console.log("Enhanced event handlers set up successfully");
    }
  }, [setupInitialMarker]);

  // Reset eventHandlersSet when neighborhood changes
  useEffect(() => {
    console.log("Neighborhood changed, resetting enhanced event handler flag");
    eventHandlersSet.current = false;
  }, [neighborhood.id]);

  const handleSetMarkerAtCenterWrapper = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (viewer.current && markersPlugin.current) {
      console.log("Setting marker at center (enhanced wrapper)");
      handleSetMarkerAtCenter(viewer.current, markersPlugin.current);
    } else {
      console.warn("Viewer or markersPlugin not available");
    }
  }, [handleSetMarkerAtCenter]);

  const handleDeleteMarkerWrapper = useCallback(() => {
    if (markersPlugin.current) {
      handleDeleteMarker(markersPlugin.current);
    }
  }, [handleDeleteMarker]);

  // Add a click handler on the sphere itself
  useEffect(() => {
    if (viewer.current && markersPlugin.current && positioningMode) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clickHandler = (e: any) => {
        console.log("Enhanced sphere click detected", e);
        handleSphereClick(e, markersPlugin.current!);
      };
      
      viewer.current.addEventListener('click', clickHandler);
      
      return () => {
        if (viewer.current) {
          viewer.current.removeEventListener('click', clickHandler);
        }
      };
    }
  }, [handleSphereClick, positioningMode]);

  // Change cursor based on positioning mode
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      if (positioningMode) {
        container.style.cursor = 'crosshair';
      } else {
        container.style.cursor = 'grab';
      }
      
      return () => {
        container.style.cursor = '';
      };
    }
  }, [positioningMode, containerRef]);

  const { viewerReady } = useViewerInitializer({
    containerRef,
    neighborhood,
    onViewerReady: handleViewerReady
  });

  return {
    viewerReady,
    hasMarker,
    positioningMode,
    isDragging,
    markerPosition,
    handleSetMarkerAtCenter: handleSetMarkerAtCenterWrapper,
    handleDeleteMarker: handleDeleteMarkerWrapper,
    togglePositioningMode
  };
}
