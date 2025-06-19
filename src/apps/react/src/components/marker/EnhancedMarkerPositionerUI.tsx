import React from "react";
import { ViewerContainer } from "./ViewerContainer";
import { EnhancedMarkerControls } from "./EnhancedMarkerControls";

interface EnhancedMarkerPositionerUIProps {
  containerRef: React.RefObject<HTMLDivElement>;
  viewerReady: boolean;
  hasMarker: boolean;
  positioningMode: boolean;
  isDragging: boolean;
  markerPosition?: { yaw: number; pitch: number } | null;
  onSetMarkerAtCenter: (e?: React.MouseEvent) => void;
  onDeleteMarker: () => void;
  onTogglePositioningMode: () => void;
}

export const EnhancedMarkerPositionerUI: React.FC<EnhancedMarkerPositionerUIProps> = ({
  containerRef,
  viewerReady,
  hasMarker,
  positioningMode,
  isDragging,
  markerPosition,
  onSetMarkerAtCenter,
  onDeleteMarker,
  onTogglePositioningMode
}) => {
  return (
    <div className="relative w-full h-full">
      <ViewerContainer containerRef={containerRef} />
      
      <div className="absolute inset-0 pointer-events-none">
        <EnhancedMarkerControls 
          viewerReady={viewerReady}
          hasMarker={hasMarker}
          positioningMode={positioningMode}
          onTogglePositioningMode={onTogglePositioningMode}
          onSetMarkerAtCenter={onSetMarkerAtCenter}
          onDeleteMarker={onDeleteMarker}
          markerPosition={markerPosition}
        />
      </div>
      
      {/* Positioning mode overlay */}
      {positioningMode && (
        <div className="absolute inset-0 pointer-events-none bg-blue-500/5 border-2 border-blue-500/20 border-dashed">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-blue-500/90 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Click anywhere to place marker
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
