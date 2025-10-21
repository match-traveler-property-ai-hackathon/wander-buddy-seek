import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";

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
}

export const HostelCard = ({
  name,
  image,
  rating,
  distance,
  price,
  ratingBreakdown,
  bookingLink,
}: HostelCardProps) => {
  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookingLink) {
      window.open(bookingLink, '_blank', 'noopener,noreferrer');
    }
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
          {ratingBreakdown && ratingBreakdown.length > 0 && (
            <div className="space-y-1.5 mb-3">
              {ratingBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.category}</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-primary text-primary" />
                    <span className="font-semibold">{item.rating.toFixed(1)}</span>
                  </div>
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
              <span className="text-2xl font-bold text-primary">€{price}</span>
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
