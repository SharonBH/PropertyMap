import React from "react";
import { formatPrice } from "@/lib/data";
import { Edit, Trash, Map, ChevronUp, ChevronDown } from "lucide-react";
import { Building } from "lucide-react";
import { PropertyTypeResponse, PropertyStatusResponse, PropertyResponse, NeighborhoodResponse } from "@/api/homemapapi";
import { resolveImageUrl } from "@/lib/imageUrl";

interface PropertiesTableProps {
  properties: PropertyResponse[];
  neighborhoods: NeighborhoodResponse[];
  propertyTypes: PropertyTypeResponse[];
  propertyStatuses: PropertyStatusResponse[];
  sortBy: string;
  sortDirection: "asc" | "desc";
  handleSort: (key: string) => void;
  handleEditProperty: (id: string) => void;
  handleDeleteProperty: (id: string) => void;
}

function getMainImage(images?: { imageUrl?: string | null; isMain?: boolean }[] | null) {
  if (!images || images.length === 0) return '/placeholder-image.jpg';
  const main = images.find(img => img.isMain);
  return resolveImageUrl(main?.imageUrl ?? images[0].imageUrl) || '/placeholder-image.jpg';
}

const PropertiesTable: React.FC<PropertiesTableProps> = ({
  properties,
  neighborhoods,
  propertyTypes,
  propertyStatuses,
  sortBy,
  sortDirection,
  handleSort,
  handleEditProperty,
  handleDeleteProperty,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-estate-light-gray">
            <th className="px-6 py-3 text-right font-medium text-gray-600">
              <button
                className="flex items-center"
                onClick={() => handleSort("title")}
              >
                <span>נכס</span>
                {sortBy === "title" && (
                  sortDirection === "asc" ? 
                  <ChevronUp className="mr-1 h-4 w-4" /> : 
                  <ChevronDown className="mr-1 h-4 w-4" />
                )}
              </button>
            </th>
            <th className="px-6 py-3 text-right font-medium text-gray-600">
              <span className="flex items-center">
                <Map className="ml-1 h-4 w-4" />
                <span>שכונה</span>
              </span>
            </th>
            <th className="px-6 py-3 text-right font-medium text-gray-600">
              <button
                className="flex items-center"
                onClick={() => handleSort("price")}
              >
                <span>מחיר</span>
                {sortBy === "price" && (
                  sortDirection === "asc" ? 
                  <ChevronUp className="mr-1 h-4 w-4" /> : 
                  <ChevronDown className="mr-1 h-4 w-4" />
                )}
              </button>
            </th>
            <th className="px-6 py-3 text-right font-medium text-gray-600">
              <button
                className="flex items-center"
                onClick={() => handleSort("date")}
              >
                <span>תאריך פרסום</span>
                {sortBy === "date" && (
                  sortDirection === "asc" ? 
                  <ChevronUp className="mr-1 h-4 w-4" /> : 
                  <ChevronDown className="mr-1 h-4 w-4" />
                )}
              </button>
            </th>
            <th className="px-6 py-3 text-right font-medium text-gray-600">
              סוג נכס
            </th>
            <th className="px-6 py-3 text-right font-medium text-gray-600">
              סטטוס נכס
            </th>
            <th className="px-6 py-3 text-right font-medium text-gray-600">
              פעולות
            </th>
          </tr>
        </thead>
        
        <tbody>
          {properties.length > 0 ? (
            properties.map((property: PropertyResponse) => {
              const neighborhood = neighborhoods.find(
                (n) => n.id === property.neighborhoodId
              );
              const propertyType = propertyTypes.find(
                (t) => t.id === property.propertyTypeId
              );
              const propertyStatus = propertyStatuses.find(
                (s) => s.id === property.propertyStatusId
              );
              
              return (
                <tr 
                  key={property.id} 
                  className="border-t border-gray-200 hover:bg-estate-light-gray/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={getMainImage(property.images)}
                        alt={property.name}
                        className="h-14 w-20 object-cover rounded-md shadow-sm border border-gray-200 ml-3"
                        style={{ minWidth: 80, minHeight: 56 }}
                      />
                      <div>
                        <div className="font-medium text-estate-dark-gray">
                          {property.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-estate-blue/10 text-estate-blue text-sm">
                      {neighborhood?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{formatPrice(property.askingPrice)}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(property.listedDate).toLocaleDateString("he-IL")}
                  </td>
                  <td className="px-6 py-4">
                    {propertyType?.name || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {propertyStatus?.name || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3 rtl:space-x-reverse">
                      <button
                        onClick={() => handleEditProperty(property.id)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="ערוך"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        aria-label="מחק"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center">
                <div className="flex flex-col items-center">
                  <Building className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">לא נמצאו נכסים</p>
                  <p className="text-sm text-gray-500">
                    נסה לשנות את הסינון או להוסיף נכס חדש
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PropertiesTable;
