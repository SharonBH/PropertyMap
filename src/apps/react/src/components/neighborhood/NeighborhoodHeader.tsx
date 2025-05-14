
import React from 'react';
import { Link } from 'react-router-dom';
import { Neighborhood } from '@/lib/data';

interface NeighborhoodHeaderProps {
  neighborhood: Neighborhood | null;
  propertiesCount: number;
  neighborhoods: Neighborhood[];
  selectedId: string | undefined;
}

const NeighborhoodHeader: React.FC<NeighborhoodHeaderProps> = ({
  neighborhood,
  propertiesCount,
  neighborhoods,
  selectedId
}) => {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {neighborhood ? neighborhood.name : 'טוען שכונה...'}
        </h1>
        <p className="text-muted-foreground">
          {neighborhood ? neighborhood.description : ''}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          מספר נכסים למכירה: {propertiesCount}
        </p>
      </header>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {neighborhoods.map((n) => (
          <Link
            key={n.id}
            to={`/neighborhood/${n.id}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${n.id === selectedId 
                ? 'bg-estate-blue text-white' 
                : 'bg-white text-estate-dark-gray hover:bg-estate-cream'
              }`}
          >
            {n.name}
          </Link>
        ))}
      </div>
    </>
  );
};

export default NeighborhoodHeader;
