
import React from "react";
import { Star } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";
import RatingsSummary from "@/components/RatingsSummary";
import { Review } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReviewsSectionProps {
  reviews: Review[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <Star className="h-6 w-6 text-estate-teal ml-2 fill-estate-teal" />
        <h2 className="text-2xl font-bold text-estate-dark-gray">דירוגים וחוות דעת</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <RatingsSummary reviews={reviews || []} />
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="recent">חוות דעת אחרונות</TabsTrigger>
              <TabsTrigger value="highest">דירוגים גבוהים</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 3)
                  .map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-sm">
                  <Star className="h-12 w-12 text-estate-teal mb-4" />
                  <h3 className="text-xl font-bold text-estate-dark-gray mb-2">אין חוות דעת</h3>
                  <p className="text-gray-600">
                    לא נמצאו חוות דעת.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="highest" className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 3)
                  .map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-sm">
                  <Star className="h-12 w-12 text-estate-teal mb-4" />
                  <h3 className="text-xl font-bold text-estate-dark-gray mb-2">אין חוות דעת</h3>
                  <p className="text-gray-600">
                    לא נמצאו חוות דעת.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
