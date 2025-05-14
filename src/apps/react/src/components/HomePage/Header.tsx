
import React from "react";
import { Building } from "lucide-react";

const Header: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center p-2 bg-estate-teal/10 rounded-full mb-4">
        <Building className="h-6 w-6 text-estate-blue" />
      </div>
      <h1 className="text-4xl font-bold text-estate-dark-gray mb-2">
        נכסים ישראליים מובילים
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        מצא את הנכס המושלם באזור המועדף עליך
      </p>
    </div>
  );
};

export default Header;
