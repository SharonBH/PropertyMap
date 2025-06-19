import React, { useState } from "react";
import { Target, MousePointer, Move, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EnhancedMarkerControlsProps {
  viewerReady: boolean;
  hasMarker: boolean;
  positioningMode: boolean;
  onTogglePositioningMode: () => void;
  onSetMarkerAtCenter: (e?: React.MouseEvent) => void;
  onDeleteMarker: () => void;
  markerPosition?: { yaw: number; pitch: number };
}

export const EnhancedMarkerControls: React.FC<EnhancedMarkerControlsProps> = ({
  viewerReady,
  hasMarker,
  positioningMode,
  onTogglePositioningMode,
  onSetMarkerAtCenter,
  onDeleteMarker,
  markerPosition
}) => {
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <>
      {/* Status Bar */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-sm text-muted-foreground px-3 py-2 rounded-lg flex items-center gap-2 border shadow-sm">
        <Target className="w-4 h-4" />
        {!viewerReady ? (
          "Loading viewer..."
        ) : positioningMode ? (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Crosshair className="w-3 h-3 mr-1" />
              לחץ לבחירת מיקום
            </Badge>
          </div>
        ) : hasMarker ? (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Target className="w-3 h-3 mr-1" />
              מיקום נבחר
            </Badge>
          </div>
        ) : (
          "מיקום לא נבחר"
        )}
      </div>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Positioning Mode Toggle */}
        <Button
          onClick={(e) => handleButtonClick(e, onTogglePositioningMode)}
          className={`pointer-events-auto transition-all ${
            positioningMode 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-background hover:bg-muted"
          }`}
          variant={positioningMode ? "default" : "outline"}
          size="sm"
          disabled={!viewerReady}
          title={positioningMode ? "Exit positioning mode" : "Enter positioning mode"}
        >
          {positioningMode ? (
            <>
              <Crosshair className="w-4 h-4 mr-2" />
              צא ממצב עדכון מיקום
            </>
          ) : (
            <>
              <MousePointer className="w-4 h-4 mr-2" />
              ערוך מיקום
            </>
          )}
        </Button>

        {/* Set at Center Button */}
        <Button
          onClick={(e) => handleButtonClick(e, onSetMarkerAtCenter)}
          className="pointer-events-auto"
          variant="outline"
          size="sm"
          disabled={!viewerReady}
          title="Place marker at center of current view"
        >
          <Target className="w-4 h-4 mr-2" />
          מרכז
        </Button>

        {/* Delete Marker Button */}
        {hasMarker && (
          <Button
            onClick={(e) => handleButtonClick(e, onDeleteMarker)}
            className="pointer-events-auto"
            variant="outline"
            size="sm"
            title="Delete current marker"
          >
            <Move className="w-4 h-4 mr-2" />
            מחק
          </Button>
        )}
      </div>

      {/* Position Info */}
      {hasMarker && markerPosition && (
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm text-sm px-3 py-2 rounded-lg border shadow-sm">
          <div className="font-medium mb-1">Marker Position</div>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div>Yaw: {markerPosition.yaw.toFixed(4)}</div>
            <div>Pitch: {markerPosition.pitch.toFixed(4)}</div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {positioningMode && (
        <div className="absolute bottom-4 right-4 bg-blue-50/90 backdrop-blur-sm text-sm px-3 py-2 rounded-lg border border-blue-200 max-w-xs">
          <div className="font-medium text-blue-800 mb-1">מצב עריכה</div>
          <div className="text-xs text-blue-600">
        לחץ על המפה כדי להגדיר מיקום.
          </div>
        </div>
      )}
    </>
  );
};
