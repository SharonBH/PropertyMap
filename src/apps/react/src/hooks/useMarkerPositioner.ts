
import { useRef, useCallback, useEffect, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { useViewerInitializer } from "./useViewerInitializer";
import { useMarkerHandler } from "./useMarkerHandler";
import { NeighborhoodResponse } from "@/api/homemapapi";

interface UseMarkerPositionerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  neighborhood: NeighborhoodResponse;
  onPositionChange: (position: { yaw: number; pitch: number }) => void;
  initialPosition?: { yaw: number; pitch: number };
}

export function useMarkerPositioner({
  containerRef,
  neighborhood,
  onPositionChange,
  initialPosition
}: UseMarkerPositionerProps) {
  const viewer = useRef<Viewer | null>(null);
  const markersPlugin = useRef<MarkersPlugin | null>(null);
  // Track if event handlers have been attached
  const eventHandlersSet = useRef(false);
    const { hasMarker, handleSphereClick, handleSetMarkerAtCenter, setupInitialMarker } = useMarkerHandler({
    onPositionChange,
    initialPosition
  });
  const handleViewerReady = useCallback((newViewer: Viewer, newMarkersPlugin: MarkersPlugin) => {
    console.log("Viewer ready callback fired");
    viewer.current = newViewer;
    markersPlugin.current = newMarkersPlugin;
    
    // Set up initial marker if provided
    setupInitialMarker(newMarkersPlugin);
    
    // Only set up event handlers once per viewer instance
    if (!eventHandlersSet.current && newViewer && newMarkersPlugin) {
      console.log("Setting up click event handlers");
      
      // Don't add click handlers directly to the viewer, as it interferes with rotation
      // Instead, we'll rely on the plugin's built-in click event
      
      eventHandlersSet.current = true;
      console.log("Event handlers set up successfully");
    }
  }, [setupInitialMarker]);

  // Reset eventHandlersSet when neighborhood changes
  useEffect(() => {
    console.log("Neighborhood changed, resetting event handler flag");
    eventHandlersSet.current = false;
  }, [neighborhood.id]);

  const handleSetMarkerAtCenterWrapper = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (viewer.current && markersPlugin.current) {
      console.log("Setting marker at center (wrapper)");
      handleSetMarkerAtCenter(viewer.current, markersPlugin.current);
    } else {
      console.warn("Viewer or markersPlugin not available");
    }
  }, [handleSetMarkerAtCenter]);

  // Add a click handler on the sphere itself
  useEffect(() => {
    if (viewer.current && markersPlugin.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clickHandler = (e: any) => {
        console.log("Sphere click detected in useEffect", e);
        handleSphereClick(e, markersPlugin.current!);
      };
      
      viewer.current.addEventListener('click', clickHandler);
      
      return () => {
        if (viewer.current) {
          viewer.current.removeEventListener('click', clickHandler);
        }
      };
    }
  }, [handleSphereClick]);

  const { viewerReady } = useViewerInitializer({
    containerRef,
    neighborhood,
    onViewerReady: handleViewerReady
  });

  return {
    viewerReady,
    hasMarker,
    handleSetMarkerAtCenter: handleSetMarkerAtCenterWrapper
  };
}
