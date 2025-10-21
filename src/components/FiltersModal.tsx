import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface FilterOptions {
  priceRange: [number, number];
  promotions: boolean;
  privateRooms: boolean;
  sustainableHostels: boolean;
  flexibleRates: boolean;
}

interface FiltersModalProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const FiltersModal = ({ filters, onFiltersChange }: FiltersModalProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...localFilters, priceRange: [value[0], value[1]] as [number, number] };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleToggle = (key: keyof Omit<FilterOptions, 'priceRange'>, value: boolean) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Price Range */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Average price per night</Label>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Min</Label>
                <div className="text-sm font-medium">${localFilters.priceRange[0]}</div>
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="flex-1 text-right">
                <Label className="text-xs text-muted-foreground">Max</Label>
                <div className="text-sm font-medium">${localFilters.priceRange[1]}</div>
              </div>
            </div>
            <Slider
              min={0}
              max={200}
              step={1}
              value={localFilters.priceRange}
              onValueChange={handlePriceChange}
              className="w-full"
            />
          </div>

          {/* Promotions */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="promotions" className="font-normal cursor-pointer">
                Promotions
              </Label>
            </div>
            <Switch
              id="promotions"
              checked={localFilters.promotions}
              onCheckedChange={(checked) => handleToggle('promotions', checked)}
            />
          </div>

          {/* Private Rooms */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="privateRooms" className="font-normal cursor-pointer">
                Private Rooms
              </Label>
            </div>
            <Switch
              id="privateRooms"
              checked={localFilters.privateRooms}
              onCheckedChange={(checked) => handleToggle('privateRooms', checked)}
            />
          </div>

          {/* Sustainable Hostels */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600 mr-1">🌱</span>
              <Label htmlFor="sustainableHostels" className="font-normal cursor-pointer">
                Sustainable Hostels
              </Label>
            </div>
            <Switch
              id="sustainableHostels"
              checked={localFilters.sustainableHostels}
              onCheckedChange={(checked) => handleToggle('sustainableHostels', checked)}
            />
          </div>

          {/* Best Flexible Rates */}
          <div className="flex items-start justify-between space-x-2">
            <div className="flex-1">
              <Label htmlFor="flexibleRates" className="font-normal cursor-pointer">
                Best Flexible Rates
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                View hostels offering great rates now, with full flexibility if your plans change.
              </p>
            </div>
            <Switch
              id="flexibleRates"
              checked={localFilters.flexibleRates}
              onCheckedChange={(checked) => handleToggle('flexibleRates', checked)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
