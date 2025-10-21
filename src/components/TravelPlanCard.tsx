import { MapPin, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TravelPlanCardProps {
  destination: string;
  date: string;
  country: string;
  flagEmoji: string;
  userImage: string;
  commentCount?: number;
}

export const TravelPlanCard = ({
  destination,
  date,
  country,
  flagEmoji,
  userImage,
  commentCount,
}: TravelPlanCardProps) => {
  return (
    <Card className="p-5 min-w-[280px] md:min-w-0 shadow-[var(--shadow-card)] border-0 rounded-2xl hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={userImage}
          alt="User"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="text-4xl">{flagEmoji}</div>
      </div>
      
      <h3 className="font-bold text-lg mb-2">{destination}</h3>
      <p className="text-muted-foreground mb-4">{date}</p>
      
      <div className="flex items-center gap-4 text-muted-foreground text-sm">
        <div className="flex items-center gap-1">
          <MapPin size={16} />
          <span>{country}</span>
        </div>
        {commentCount && (
          <div className="flex items-center gap-1">
            <MessageSquare size={16} />
            <span>{commentCount}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
