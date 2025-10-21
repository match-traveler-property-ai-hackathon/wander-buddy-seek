import { useState } from "react";
import { SlidersHorizontal, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface FilterOptions {
  priceRange: [number, number];
  flexibleRates: boolean;
  rating: string;
  roomTypes: {
    dormEnsuite: boolean;
    mixedDorm: boolean;
    femaleDorm: boolean;
    maleDorm: boolean;
    privateEnsuite: boolean;
    singleRoom: boolean;
    twinRoom: boolean;
    doubleRoom: boolean;
    tripleRoom: boolean;
    familyRoom: boolean;
  };
  sustainabilityLevel: string;
  facilities: string[];
  propertyTypes: string[];
}

interface FiltersModalProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const FiltersModal = ({ filters, onFiltersChange }: FiltersModalProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const allFacilities = [
    "Free WiFi", "Free Breakfast", "Air Conditioning", "Swimming Pool",
    "24 Hour Reception", "Bar", "Free Internet Access", "Luggage Storage",
    "Free Parking", "Car Parking Available", "24 Hour Security", "Self-Catering Facilities",
    "Common Room", "Laundry Facilities", "Card Phones", "Cafe"
  ];

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...localFilters, priceRange: [value[0], value[1]] as [number, number] };
    setLocalFilters(newFilters);
  };

  const handleClear = () => {
    const clearedFilters: FilterOptions = {
      priceRange: [0, 200],
      flexibleRates: false,
      rating: "All",
      roomTypes: {
        dormEnsuite: false,
        mixedDorm: false,
        femaleDorm: false,
        maleDorm: false,
        privateEnsuite: false,
        singleRoom: false,
        twinRoom: false,
        doubleRoom: false,
        tripleRoom: false,
        familyRoom: false,
      },
      sustainabilityLevel: "All",
      facilities: [],
      propertyTypes: [],
    };
    setLocalFilters(clearedFilters);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const toggleFacility = (facility: string) => {
    const newFacilities = localFilters.facilities.includes(facility)
      ? localFilters.facilities.filter(f => f !== facility)
      : [...localFilters.facilities, facility];
    setLocalFilters({ ...localFilters, facilities: newFacilities });
  };

  const togglePropertyType = (type: string) => {
    const newTypes = localFilters.propertyTypes.includes(type)
      ? localFilters.propertyTypes.filter(t => t !== type)
      : [...localFilters.propertyTypes, type];
    setLocalFilters({ ...localFilters, propertyTypes: newTypes });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                <Input 
                  type="number" 
                  value={localFilters.priceRange[0]} 
                  onChange={(e) => handlePriceChange([parseInt(e.target.value) || 0, localFilters.priceRange[1]])}
                  className="h-9"
                />
              </div>
              <span className="text-muted-foreground mt-6">-</span>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input 
                  type="number" 
                  value={localFilters.priceRange[1]} 
                  onChange={(e) => handlePriceChange([localFilters.priceRange[0], parseInt(e.target.value) || 200])}
                  className="h-9"
                />
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

          {/* Best Flexible Rates */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Best Flexible Rates</Label>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="flexibleRates"
                checked={localFilters.flexibleRates}
                onCheckedChange={(checked) => setLocalFilters({ ...localFilters, flexibleRates: checked as boolean })}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="flexibleRates" className="text-sm font-normal cursor-pointer">
                  View hostels offering great rates now, with full flexibility if your plans change.
                </label>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Rating</Label>
            <div className="flex flex-wrap gap-2">
              {["10", "9+", "8+", "7+", "6+", "All"].map((rating) => (
                <Button
                  key={rating}
                  variant={localFilters.rating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLocalFilters({ ...localFilters, rating })}
                  className="gap-1"
                >
                  <Star className="h-3 w-3" />
                  {rating}
                </Button>
              ))}
            </div>
          </div>

          {/* Room Types */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Room</Label>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium mb-2 block">Dorm</Label>
                <div className="space-y-2 ml-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dormEnsuite"
                      checked={localFilters.roomTypes.dormEnsuite}
                      onCheckedChange={(checked) => 
                        setLocalFilters({ ...localFilters, roomTypes: { ...localFilters.roomTypes, dormEnsuite: checked as boolean } })
                      }
                    />
                    <label htmlFor="dormEnsuite" className="text-sm cursor-pointer">Ensuite Room</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mixedDorm"
                      checked={localFilters.roomTypes.mixedDorm}
                      onCheckedChange={(checked) => 
                        setLocalFilters({ ...localFilters, roomTypes: { ...localFilters.roomTypes, mixedDorm: checked as boolean } })
                      }
                    />
                    <label htmlFor="mixedDorm" className="text-sm cursor-pointer">Mixed Dorm</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="femaleDorm"
                      checked={localFilters.roomTypes.femaleDorm}
                      onCheckedChange={(checked) => 
                        setLocalFilters({ ...localFilters, roomTypes: { ...localFilters.roomTypes, femaleDorm: checked as boolean } })
                      }
                    />
                    <label htmlFor="femaleDorm" className="text-sm cursor-pointer">Female Dorm</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="maleDorm"
                      checked={localFilters.roomTypes.maleDorm}
                      onCheckedChange={(checked) => 
                        setLocalFilters({ ...localFilters, roomTypes: { ...localFilters.roomTypes, maleDorm: checked as boolean } })
                      }
                    />
                    <label htmlFor="maleDorm" className="text-sm cursor-pointer">Male Dorm</label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Private Room</Label>
                <div className="space-y-2 ml-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="privateEnsuite"
                      checked={localFilters.roomTypes.privateEnsuite}
                      onCheckedChange={(checked) => 
                        setLocalFilters({ ...localFilters, roomTypes: { ...localFilters.roomTypes, privateEnsuite: checked as boolean } })
                      }
                    />
                    <label htmlFor="privateEnsuite" className="text-sm cursor-pointer">Ensuite Room</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="singleRoom"
                      checked={localFilters.roomTypes.singleRoom}
                      onCheckedChange={(checked) => 
                        setLocalFilters({ ...localFilters, roomTypes: { ...localFilters.roomTypes, singleRoom: checked as boolean } })
                      }
                    />
                    <label htmlFor="singleRoom" className="text-sm cursor-pointer">Single Room</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="twinRoom"
                      checked={localFilters.roomTypes.twinRoom}
                      onCheckedChange={(checked) => 
                        setLocalFilters({ ...localFilters, roomTypes: { ...localFilters.roomTypes, twinRoom: checked as boolean } })
                      }
                    />
                    <label htmlFor="twinRoom" className="text-sm cursor-pointer">Twin Room</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="doubleRoom"
                      checked={localFilters.roomTypes.doubleRoom}
                      onCheckedChange={(checked) => 
                        setLocalFilters({ ...localFilters, roomTypes: { ...localFilters.roomTypes, doubleRoom: checked as boolean } })
                      }
                    />
                    <label htmlFor="doubleRoom" className="text-sm cursor-pointer">Double Room</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tripleRoom"
                      checked={localFilters.roomTypes.tripleRoom}
                      onCheckedChange={(checked) => 
                        setLocalFilters({ ...localFilters, roomTypes: { ...localFilters.roomTypes, tripleRoom: checked as boolean } })
                      }
                    />
                    <label htmlFor="tripleRoom" className="text-sm cursor-pointer">Triple Room</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="familyRoom"
                      checked={localFilters.roomTypes.familyRoom}
                      onCheckedChange={(checked) => 
                        setLocalFilters({ ...localFilters, roomTypes: { ...localFilters.roomTypes, familyRoom: checked as boolean } })
                      }
                    />
                    <label htmlFor="familyRoom" className="text-sm cursor-pointer">Family Room</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sustainable Hostels */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Sustainable Hostels</Label>
            <div className="flex flex-wrap gap-2">
              {["All", "Level 1", "Level 2", "Level 3", "Level 3+"].map((level) => (
                <Button
                  key={level}
                  variant={localFilters.sustainabilityLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLocalFilters({ ...localFilters, sustainabilityLevel: level })}
                  className="gap-1"
                >
                  <span className="text-green-600">🌱</span>
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Facilities</Label>
            <div className="flex flex-wrap gap-2">
              {(showAllFacilities ? allFacilities : allFacilities.slice(0, 8)).map((facility) => (
                <Button
                  key={facility}
                  variant={localFilters.facilities.includes(facility) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFacility(facility)}
                >
                  {facility}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllFacilities(!showAllFacilities)}
              className="w-full gap-2"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showAllFacilities ? 'rotate-180' : ''}`} />
              {showAllFacilities ? 'Show less' : 'Show more'}
            </Button>
          </div>

          {/* Property Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Property Type</Label>
            <div className="space-y-2">
              {["Hostels", "Bed and Breakfasts", "Hotels", "Apartments", "Campsites"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={localFilters.propertyTypes.includes(type)}
                    onCheckedChange={() => togglePropertyType(type)}
                  />
                  <label htmlFor={type} className="text-sm cursor-pointer">{type}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex justify-between w-full items-center">
            <Button variant="ghost" onClick={handleClear}>
              Clear
            </Button>
            <Button onClick={handleApply}>
              Apply
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
