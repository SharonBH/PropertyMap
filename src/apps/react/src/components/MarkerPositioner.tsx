
import React, { useRef } from "react";
import { Neighborhood } from "@/lib/data";
import { useMarkerPositioner } from "@/hooks/useMarkerPositioner";
import { MarkerPositionerUI } from "./marker/MarkerPositionerUI";

import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

interface MarkerPositionerProps {
  neighborhood: Neighborhood;
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
