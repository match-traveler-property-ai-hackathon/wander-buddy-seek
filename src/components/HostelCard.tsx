import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, StarHalf } from "lucide-react";

interface RatingBreakdownItem {
  category: string;
  rating: number;
}

interface HostelCardProps {
  name: string;
  image: string;
  rating: number;
  distance: string;
  price: number;
  ratingBreakdown?: RatingBreakdownItem[];
  bookingLink?: string;
  reason?: string;
}

export const HostelCard = ({
  name,
  image,
  rating,
  distance,
  price,
  ratingBreakdown,
  bookingLink,
  reason,
}: HostelCardProps) => {
  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookingLink) {
      window.open(bookingLink, '_blank', 'noopener,noreferrer');
    }
  };

  // Convert 1-10 rating to 1-5 stars, rounding to nearest 0.5
  const getStarRating = (rating: number) => {
    const stars = Math.round((rating / 2) * 2) / 2; // Round to nearest 0.5
    return Math.max(0.5, Math.min(5, stars)); // Clamp between 0.5 and 5
  };

  const renderStars = (score: number) => {
    const stars = getStarRating(score);
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars % 1 !== 0;
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={14} className="fill-primary text-primary" />
        ))}
        {hasHalfStar && <StarHalf size={14} className="fill-primary text-primary" />}
        {[...Array(5 - Math.ceil(stars))].map((_, i) => (
          <Star key={`empty-${i}`} size={14} className="text-muted-foreground" />
        ))}
      </div>
    );
  };

  return (
    <Card 
      className="md:min-w-[320px] md:max-w-[320px] overflow-hidden border-0 shadow-[var(--shadow-card)] rounded-2xl hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg mb-2">{name}</h3>
          {reason && (
            <p className="text-sm text-muted-foreground mb-3 italic">
              {reason}
            </p>
          )}
          {ratingBreakdown && ratingBreakdown.length > 0 && (
            <div className="space-y-1.5 mb-3">
              {ratingBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.category}</span>
                  {renderStars(item.rating)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star size={16} className="fill-primary text-primary" />
            <span className="font-semibold text-foreground">{rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin size={16} />
            <span>{distance}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">€{price.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">/night</span>
            </div>
            {bookingLink && (
              <Button 
                onClick={handleBookNow}
                size="sm"
                className="px-4"
              >
                Book Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
