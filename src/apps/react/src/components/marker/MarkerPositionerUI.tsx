
import React from "react";
import { ViewerContainer } from "./ViewerContainer";
import { MarkerControls } from "../MarkerControls";
import { MarkerStatus } from "../MarkerStatus";

interface MarkerPositionerUIProps {
  containerRef: React.RefObject<HTMLDivElement>;
  viewerReady: boolean;
  hasMarker: boolean;
  onSetMarkerAtCenter: (e?: React.MouseEvent) => void;
}

export const MarkerPositionerUI: React.FC<MarkerPositionerUIProps> = ({
  containerRef,
  viewerReady,
  hasMarker,
  onSetMarkerAtCenter
}) => {
  return (
    <div className="relative w-full h-full">
      <ViewerContainer containerRef={containerRef} />
      
      <div className="absolute inset-0 pointer-events-none">
        <MarkerControls 
          viewerReady={viewerReady} 
          onSetMarkerAtCenter={onSetMarkerAtCenter} 
        />
        {hasMarker && <MarkerStatus />}
      </div>
    </div>
  );
};
