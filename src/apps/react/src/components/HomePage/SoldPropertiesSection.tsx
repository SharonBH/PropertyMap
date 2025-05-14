
import React from "react";
import { CheckCircle } from "lucide-react";
import SoldPropertyCard from "@/components/SoldPropertyCard";
import { Property } from "@/lib/data";

interface SoldPropertiesSectionProps {
  soldProperties: Property[];
}

const SoldPropertiesSection: React.FC<SoldPropertiesSectionProps> = ({ soldProperties }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <CheckCircle className="h-6 w-6 text-secondary ml-2" />
        <h2 className="text-2xl font-bold text-foreground">נכסים שנמכרו לאחרונה</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {soldProperties && soldProperties.length > 0 ? (
          soldProperties.slice(0, 3).map((property) => (
            <SoldPropertyCard key={property.id} property={property} />
          ))
        ) : (
          <div className="col-span-3 flex flex-col items-center justify-center p-8 text-center bg-card rounded-lg shadow-sm">
            <CheckCircle className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">אין נכסים שנמכרו לאחרונה</h3>
            <p className="text-muted-foreground">
              לא נמצאו נכסים שנמכרו לאחרונה.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoldPropertiesSection;
