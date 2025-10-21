import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";

interface HostelCardProps {
  name: string;
  image: string;
  rating: number;
  distance: string;
  price: number;
  benefits: string[];
  bookingLink?: string;
}

export const HostelCard = ({
  name,
  image,
  rating,
  distance,
  price,
  benefits,
  bookingLink,
}: HostelCardProps) => {
  const handleClick = () => {
    if (bookingLink) {
      window.open(bookingLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className="md:min-w-[320px] md:max-w-[320px] overflow-hidden border-0 shadow-[var(--shadow-card)] rounded-2xl hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
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
          <div className="flex flex-wrap gap-2 mb-3">
            {benefits.map((benefit, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-1"
              >
                {benefit}
              </Badge>
            ))}
          </div>
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
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">€{price}</span>
            <span className="text-sm text-muted-foreground">/night</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
