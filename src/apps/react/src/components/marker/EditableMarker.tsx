import React, { useState, useCallback } from "react";
import { Move, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditableMarkerProps {
  position: { yaw: number; pitch: number };
  onPositionChange: (position: { yaw: number; pitch: number }) => void;
  onDelete: () => void;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const EditableMarker: React.FC<EditableMarkerProps> = ({
  position,
  onPositionChange,
  onDelete,
  isDragging,
  onDragStart,
  onDragEnd
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 ${
        isDragging ? 'scale-110 z-50' : 'z-10'
      } ${isHovered ? 'scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Marker Pin */}
      <div className="relative">
        {/* Pin Line */}
        <div 
          className={`w-1 h-8 mx-auto transition-colors duration-200 ${
            isDragging ? 'bg-blue-500' : isHovered ? 'bg-red-500' : 'bg-red-600'
          }`}
        />
        
        {/* Pin Head */}
        <div 
          className={`w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
            isDragging ? 'bg-blue-500 scale-125' : isHovered ? 'bg-red-500' : 'bg-red-600'
          }`}
          style={{ marginTop: '-3px' }}
        />
        
        {/* Controls - Show on hover or when dragging */}
        {(isHovered || isDragging) && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-blue-100"
              onMouseDown={(e) => {
                e.stopPropagation();
                onDragStart();
              }}
              title="Drag to move"
            >
              <Move className="w-3 h-3 text-blue-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-red-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete marker"
            >
              <Trash2 className="w-3 h-3 text-red-600" />
            </Button>
          </div>
        )}
        
        {/* Position Info - Show when dragging */}
        {isDragging && (
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Yaw: {position.yaw.toFixed(3)}<br />
            Pitch: {position.pitch.toFixed(3)}
          </div>
        )}
      </div>
    </div>
  );
};
