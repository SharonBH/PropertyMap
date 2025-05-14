
import React from "react";
import { Building } from "lucide-react";

const WhyChooseUsSection: React.FC = () => {
  return (
    <div className="bg-estate-light-gray p-8 rounded-xl shadow-soft">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-estate-dark-gray">למה לבחור בנו?</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm text-center">
          <div className="bg-estate-teal/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <Building className="h-6 w-6 text-estate-blue" />
          </div>
          <h3 className="text-lg font-bold text-estate-dark-gray mb-2">מבחר נכסים איכותיים</h3>
          <p className="text-gray-600">מגוון רחב של נכסים באזורים המבוקשים ביותר</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm text-center">
          <div className="bg-estate-teal/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <Building className="h-6 w-6 text-estate-blue" />
          </div>
          <h3 className="text-lg font-bold text-estate-dark-gray mb-2">סוכנים מקצועיים</h3>
          <p className="text-gray-600">צוות סוכנים מנוסה שמכיר כל שכונה לעומק</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm text-center">
          <div className="bg-estate-teal/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <Building className="h-6 w-6 text-estate-blue" />
          </div>
          <h3 className="text-lg font-bold text-estate-dark-gray mb-2">ליווי אישי</h3>
          <p className="text-gray-600">ליווי צמוד לאורך כל תהליך הרכישה או המכירה</p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsSection;
