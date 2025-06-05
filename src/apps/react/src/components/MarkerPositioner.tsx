
import React, { useRef } from "react";
import { useMarkerPositioner } from "@/hooks/useMarkerPositioner";
import { MarkerPositionerUI } from "./marker/MarkerPositionerUI";

import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { NeighborhoodResponse } from "@/api/homemapapi";

interface MarkerPositionerProps {
  neighborhood: NeighborhoodResponse;
  onPositionChange: (position: { yaw: number; pitch: number }) => void;
}

const MarkerPositioner: React.FC<MarkerPositionerProps> = ({ 
  neighborhood,
  onPositionChange
}) => {
  const viewerContainer = useRef<HTMLDivElement>(null);
  const { 
    viewerReady, 
    hasMarker, 
    handleSetMarkerAtCenter 
  } = useMarkerPositioner({
    containerRef: viewerContainer,
    neighborhood,
    onPositionChange
  });

  return (
    <MarkerPositionerUI
      containerRef={viewerContainer}
      viewerReady={viewerReady}
      hasMarker={hasMarker}
      onSetMarkerAtCenter={handleSetMarkerAtCenter}
    />
  );
};

export default MarkerPositioner;
