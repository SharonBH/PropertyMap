
import React from "react";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarkerControlsProps {
  viewerReady: boolean;
  onSetMarkerAtCenter: (e?: React.MouseEvent) => void;
}

export const MarkerControls: React.FC<MarkerControlsProps> = ({
  viewerReady,
  onSetMarkerAtCenter
}) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSetMarkerAtCenter(e);
  };

  return (
    <>
      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-sm text-muted-foreground px-3 py-2 rounded-lg flex items-center gap-2">
        <Target className="w-4 h-4" />
        {viewerReady ? "Navigate to location and click to place marker" : "Loading viewer..."}
      </div>
      
      <Button 
        onClick={handleButtonClick}
        className="absolute top-4 right-4 pointer-events-auto"
        variant="default"
        size="sm"
        disabled={!viewerReady}
      >
        Set Marker at Center
      </Button>
    </>
  );
};
