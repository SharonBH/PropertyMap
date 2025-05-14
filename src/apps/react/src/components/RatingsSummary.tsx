
import React from "react";
import { Review } from "@/lib/data";
import { StarIcon, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RatingsSummaryProps {
  reviews: Review[];
}

const RatingsSummary: React.FC<RatingsSummaryProps> = ({ reviews }) => {
  if (!reviews.length) return null;

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  // Count ratings by star value
  const ratingCounts = {
    5: reviews.filter((review) => review.rating === 5).length,
    4: reviews.filter((review) => review.rating === 4).length,
    3: reviews.filter((review) => review.rating === 3).length,
    2: reviews.filter((review) => review.rating === 2).length,
    1: reviews.filter((review) => review.rating === 1).length,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-estate-teal/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-estate-teal mr-2" />
          <h3 className="text-xl font-bold text-estate-dark-gray">דירוג לקוחות</h3>
        </div>
        <div className="flex items-center">
          <div className="text-2xl font-bold text-estate-dark-gray ml-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon
                key={index}
                className={`h-5 w-5 ${
                  index < Math.round(averageRating) 
                    ? "text-yellow-400 fill-yellow-400" 
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const percentage = (ratingCounts[rating as keyof typeof ratingCounts] / reviews.length) * 100;
          
          return (
            <div key={rating} className="flex items-center">
              <div className="flex items-center ml-2 w-12">
                <span className="text-sm text-gray-700 ml-1">{rating}</span>
                <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="flex-1 ml-2">
                <Progress value={percentage} className="h-2" />
              </div>
              <div className="w-12 text-right">
                <span className="text-sm text-gray-600">
                  {ratingCounts[rating as keyof typeof ratingCounts]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        מבוסס על {reviews.length} חוות דעת
      </div>
    </div>
  );
};

export default RatingsSummary;
