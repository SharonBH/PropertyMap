import React from "react";

interface NeighborhoodOverlayProps {
  neighborhoods: Array<{ id: string; name: string; iconUrl?: string }>;
  selectedId?: string;
  onSelect: (id: string) => void;
}

const NeighborhoodOverlay: React.FC<NeighborhoodOverlayProps> = ({ neighborhoods, selectedId, onSelect }) => {
  return (
    <div className="absolute top-30 left-1/2 transform -translate-x-1/2 z-20 flex gap-4 px-4 py-2">
      {neighborhoods.map((n) => (
        <button
          key={n.id}
          onClick={() => onSelect(n.id)}
          className={`flex flex-col items-center focus:outline-none ${selectedId === n.id ? 'text-primary font-bold' : 'text-gray-700'}`}
        >
          {n.iconUrl ? (
            <img src={n.iconUrl} alt={n.name} className="w-8 h-8 mb-1 rounded-full border-2 border-gray-300" />
          ) : (
            <span className="w-8 h-8 mb-1 flex items-center justify-center rounded-full bg-gray-200 text-lg">🏙️</span>
          )}
          <span className="text-xs">{n.name}</span>
        </button>
      ))}
    </div>
  );
};

export default NeighborhoodOverlay;
