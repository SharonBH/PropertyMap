
import React from "react";

interface ViewerContainerProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const ViewerContainer: React.FC<ViewerContainerProps> = ({ containerRef }) => {
  return (
    <div ref={containerRef} className="w-full aspect-square bg-muted"></div>
  );
};
