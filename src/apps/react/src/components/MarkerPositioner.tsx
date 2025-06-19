
import React, { useRef } from "react";
import { useEnhancedMarkerPositioner } from "@/hooks/useEnhancedMarkerPositioner";
import { EnhancedMarkerPositionerUI } from "./marker/EnhancedMarkerPositionerUI";

import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { NeighborhoodResponse } from "@/api/homemapapi";

interface MarkerPositionerProps {
  neighborhood: NeighborhoodResponse;
  onPositionChange: (position: { yaw: number; pitch: number }) => void;
  initialPosition?: { yaw: number; pitch: number };
}

const MarkerPositioner: React.FC<MarkerPositionerProps> = ({ 
  neighborhood,
  onPositionChange,
  initialPosition
}) => {
  const viewerContainer = useRef<HTMLDivElement>(null);
  const { 
    viewerReady, 
    hasMarker,
    positioningMode,
    isDragging,
    markerPosition,
    handleSetMarkerAtCenter,
    handleDeleteMarker,
    togglePositioningMode
  } = useEnhancedMarkerPositioner({
    containerRef: viewerContainer,
    neighborhood,
    onPositionChange,
    initialPosition
  });

  return (
    <EnhancedMarkerPositionerUI
      containerRef={viewerContainer}
      viewerReady={viewerReady}
      hasMarker={hasMarker}
      positioningMode={positioningMode}
      isDragging={isDragging}
      markerPosition={markerPosition}
      onSetMarkerAtCenter={handleSetMarkerAtCenter}
      onDeleteMarker={handleDeleteMarker}
      onTogglePositioningMode={togglePositioningMode}
    />
  );
};

export default MarkerPositioner;
