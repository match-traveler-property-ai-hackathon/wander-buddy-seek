import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RecentSearchItemProps {
  destination: string;
  dates: string;
  guests: string;
}

export const RecentSearchItem = ({ destination, dates, guests }: RecentSearchItemProps) => {
  return (
    <Card className="p-4 flex items-start gap-4 shadow-[var(--shadow-card)] border-0 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer">
      <div className="mt-1">
        <Search className="text-primary" size={24} />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-base mb-1">{destination}</h4>
        <p className="text-sm text-muted-foreground">{dates}</p>
        <p className="text-sm text-muted-foreground">{guests}</p>
      </div>
    </Card>
  );
};
