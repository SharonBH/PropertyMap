
import React from "react";
import { Review, formatDate } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StarIcon, User } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="overflow-hidden border border-gray-100 transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-estate-teal/20 rounded-full p-2 mr-2">
              <User className="h-4 w-4 text-estate-teal" />
            </div>
            <h3 className="text-lg font-bold text-estate-dark-gray">
              {review.clientName}
            </h3>
          </div>
          <div className="flex">{renderStars(review.rating)}</div>
        </div>
        <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-gray-600">{review.comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
