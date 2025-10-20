import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchWidget = () => {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center bg-white rounded-[1.5rem] shadow-[var(--shadow-search)] overflow-hidden">
        <MapPin className="absolute left-5 text-muted-foreground" size={24} />
        <Input
          placeholder="Where to next?"
          className="pl-14 pr-20 h-16 text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[1.5rem]"
        />
        <Button 
          size="icon" 
          className="absolute right-2 h-12 w-12 rounded-[1rem] bg-accent hover:bg-accent/90"
        >
          <Search className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
