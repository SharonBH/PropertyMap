
import React from "react";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  agentName: string;
  handleAddProperty: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ agentName, handleAddProperty }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-estate-dark-gray mb-2">
          ניהול נכסים
        </h1>
        <p className="text-gray-600">
          שלום {agentName}, נהל את כל הנכסים שלך במקום אחד
        </p>
      </div>
      
      <button
        onClick={handleAddProperty}
        className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-estate-blue text-white rounded-lg font-medium hover:bg-estate-blue/90 transition-colors"
      >
        <Plus className="ml-2 h-5 w-5" />
        הוסף נכס חדש
      </button>
    </div>
  );
};

export default PageHeader;
