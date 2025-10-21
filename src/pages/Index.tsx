import { useState, useEffect, useRef } from "react";
import { SearchWidget } from "@/components/SearchWidget";
import { TravelPlanCard } from "@/components/TravelPlanCard";
import { RecentSearchItem } from "@/components/RecentSearchItem";
import { DiscountCard } from "@/components/DiscountCard";
import { InspiredCard } from "@/components/InspiredCard";
import { HostelCard } from "@/components/HostelCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { FiltersModal, FilterOptions } from "@/components/FiltersModal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMcpHostelSearch } from "@/hooks/useMcpHostelSearch";
import { useUserProfile } from "@/hooks/useUserProfile";
import { buildProfileQuery } from "@/utils/profileQuery";
import { McpInspector } from "@/components/McpInspector";
import barcelonaImg from "@/assets/barcelona.jpg";
import sydneyImg from "@/assets/sydney.jpg";
import londonImg from "@/assets/london.jpg";
import berlinImg from "@/assets/berlin.jpg";
import londonDiscountImg from "@/assets/london-discount.jpg";
import beijingImg from "@/assets/beijing.jpg";
import mexicoCityImg from "@/assets/mexico-city.jpg";
import amsterdamImg from "@/assets/amsterdam.jpg";
import romeImg from "@/assets/rome.jpg";
import lisbonImg from "@/assets/lisbon.jpg";
import profileImg from "@/assets/profile.jpg";
import profile2Img from "@/assets/profile2.jpg";
import profile3Img from "@/assets/profile3.jpg";
import profile4Img from "@/assets/profile4.jpg";
import profile5Img from "@/assets/profile5.jpg";
import hostel1Img from "@/assets/hostel1.jpg";
import hostel2Img from "@/assets/hostel2.jpg";
import hostel3Img from "@/assets/hostel3.jpg";
import hostel4Img from "@/assets/hostel4.jpg";
import hostel5Img from "@/assets/hostel5.jpg";

const Index = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const hostelScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
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
  });
  const { 
    searchHostels, 
    isSearching, 
    hostels: mcpHostels
  } = useMcpHostelSearch();
  const { profile, loading: profileLoading } = useUserProfile();

  // Default hostels to display initially
  const defaultHostels = [
    {
      name: "Casa Pepe",
      image: hostel1Img,
      rating: 4.8,
      distance: "1.2 km from centre",
      price: 25,
      benefits: ["Pet-friendly", "Social", "Free WiFi"],
      bookingLink: undefined
    },
    {
      name: "Mexico City Rooftop",
      image: hostel2Img,
      rating: 4.9,
      distance: "0.8 km from centre",
      price: 32,
      benefits: ["Pet-friendly", "Rooftop terrace", "Kitchen"],
      bookingLink: undefined
    },
    {
      name: "La Casa Colorida",
      image: hostel3Img,
      rating: 4.7,
      distance: "1.5 km from centre",
      price: 28,
      benefits: ["Pet-friendly", "Social", "Bar"],
      bookingLink: undefined
    },
    {
      name: "Green Garden Hostel",
      image: hostel4Img,
      rating: 4.9,
      distance: "2.1 km from centre",
      price: 30,
      benefits: ["Pet-friendly", "Eco-friendly", "Garden"],
      bookingLink: undefined
    },
    {
      name: "Colonial Charm",
      image: hostel5Img,
      rating: 4.6,
      distance: "1.8 km from centre",
      price: 27,
      benefits: ["Pet-friendly", "Historic building", "Courtyard"],
      bookingLink: undefined
    }
  ];

  const displayHostels = mcpHostels.length > 0 ? mcpHostels : defaultHostels;

  // Check scroll position
  const checkScroll = () => {
    if (hostelScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = hostelScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (hostelScrollRef.current) {
      const scrollAmount = 340; // card width + gap
      hostelScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const scrollContainer = hostelScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => scrollContainer.removeEventListener('scroll', checkScroll);
    }
  }, [displayHostels]);

  // Automatic profile-based search on page load
  useEffect(() => {
    if (!profileLoading && profile && !initialLoadComplete) {
      performProfileSearch();
      setInitialLoadComplete(true);
    }
  }, [profile, profileLoading, initialLoadComplete]);

  const performProfileSearch = async () => {
    if (!profile) return;

    const query = buildProfileQuery(profile);
    console.log('Performing profile-based search:', query);

    try {
      const result = await searchHostels(query, true); // true = profile-based
      
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: `Found ${result.count} hostels based on your preferences.`,
        });
      }
    } catch (error) {
      console.error('Profile search failed:', error);
      // Don't show error toast for automatic search
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      toast({
        title: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting MCP search for:', query);

    try {
      const result = await searchHostels(query, false); // false = manual search

      if (result.success) {
        toast({
          title: "Search complete!",
          description: `Found ${result.count} hostels matching your criteria`,
        });
      } else {
        toast({
          title: "No results found",
          description: "Try adjusting your search criteria",
        });
      }
    } catch (error) {
      console.error('Error searching hostels:', error);
      toast({
        title: "Search failed",
        description: "Unable to search hostels. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-background md:pb-0 pb-24">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-br from-primary via-primary to-primary-light px-6 pt-8 md:pt-12 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-4">
              <DesktopNavigation />
              <h1 className="text-white text-2xl md:text-4xl font-bold max-w-[250px] md:max-w-xl">
                Your next adventure starts here!
              </h1>
            </div>
            <img
              src={profileImg}
              alt="Profile"
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white"
            />
          </div>
          <div className="md:max-w-2xl">
            <SearchWidget />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Hostels Section */}
        <section className="py-8 md:py-12 mb-6 bg-white rounded-t-[2rem] rounded-b-2xl -mt-6 relative z-10">
          <div className="px-6 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Hostels just for you</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {profileLoading ? 'Loading your preferences...' : 'Personalized hostels based on your profile'}
            </p>
          </div>
          <div className="relative">
            {/* Left Arrow */}
            {canScrollLeft && (
              <Button
                variant="outline"
                size="icon"
                className="hidden md:flex absolute left-4 top-24 z-20 rounded-full bg-white/90 shadow-lg hover:bg-white hover:shadow-xl transition-all"
                onClick={() => scroll('left')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            
            {/* Right Arrow */}
            {canScrollRight && (
              <Button
                variant="outline"
                size="icon"
                className="hidden md:flex absolute right-4 top-24 z-20 rounded-full bg-white/90 shadow-lg hover:bg-white hover:shadow-xl transition-all"
                onClick={() => scroll('right')}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}

            {(isSearching || profileLoading) && displayHostels.length === 0 ? (
              <div className="grid grid-cols-1 md:flex md:gap-6 md:overflow-x-auto gap-4 pb-4 px-6 scrollbar-hide">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="md:min-w-[320px] md:max-w-[320px] space-y-3">
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div 
                ref={hostelScrollRef}
                className="grid grid-cols-1 md:flex md:gap-6 md:overflow-x-auto gap-4 pb-4 px-6 scrollbar-hide scroll-smooth"
              >
                {displayHostels.map((hostel, index) => (
                  <HostelCard
                    key={index}
                    name={hostel.name}
                    image={hostel.image}
                    rating={hostel.rating}
                    distance={hostel.distance}
                    price={hostel.price}
                    benefits={hostel.benefits}
                    bookingLink={hostel.bookingLink}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* AI Search Section */}
        <section className="px-6 py-8 md:py-12 bg-white rounded-2xl mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">AI Search</h2>
          
          <div className="max-w-2xl space-y-3 md:space-y-0 mb-4">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="describe your ideal hostel features and location"
                  className="pl-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSearching}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSearch(searchQuery)}
                  disabled={isSearching}
                  className="gap-2"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Search
                </Button>
                <FiltersModal filters={filters} onFiltersChange={setFilters} />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            <button 
              onClick={() => {
                const query = "Find me a hostel for tonight nearby";
                setSearchQuery(query);
                handleSearch(query);
              }}
              disabled={isSearching}
              className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              Find me a hostel for tonight nearby
            </button>
            <button 
              onClick={() => {
                const query = "Social and pet-friendly hostels in Mexico City";
                setSearchQuery(query);
                handleSearch(query);
              }}
              disabled={isSearching}
              className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              Social and pet-friendly hostels in Mexico City
            </button>
            <button 
              onClick={() => {
                const query = "Hostels on the mediterranean with a surf school nearby";
                setSearchQuery(query);
                handleSearch(query);
              }}
              disabled={isSearching}
              className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              Hostels on the mediterranean with a surf school nearby
            </button>
          </div>
        </section>

        {/* Travel Plans Section */}
        <section className="px-6 py-8 md:py-12 bg-white rounded-2xl mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl md:text-3xl font-bold">Travel Plans</h2>
            <Badge className="bg-primary text-white hover:bg-primary rounded-full px-3 py-1 text-xs font-bold">
              NEW!
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base leading-relaxed">
            The best place to find travel buddies! See everyone's plans and share your own
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            <TravelPlanCard
              destination="Mexico City and Oaxaca"
              date="Nov 2025"
              country="Mexico"
              flagEmoji="🇲🇽"
              userImage={profileImg}
            />
            <TravelPlanCard
              destination="italy"
              date="Oct 2025"
              country="Italy"
              flagEmoji="🇮🇹"
              userImage={profile2Img}
              commentCount={1}
            />
            <TravelPlanCard
              destination="Europe train trip"
              date="Sep 2025"
              country="Europe"
              flagEmoji="🇪🇺"
              userImage={profile3Img}
              commentCount={3}
            />
            <TravelPlanCard
              destination="Bali surftrip"
              date="Dec 2025"
              country="Indonesia"
              flagEmoji="🇮🇩"
              userImage={profile4Img}
            />
            <TravelPlanCard
              destination="South india + Sri Lanka"
              date="Jan 2026"
              country="India & Sri Lanka"
              flagEmoji="🇮🇳"
              userImage={profile5Img}
              commentCount={2}
            />
          </div>
          <button className="text-primary font-semibold mt-4 md:mt-6 text-sm md:text-base hover:underline">See all</button>
        </section>

        {/* Recent Searches Section */}
        <section className="px-6 py-8 md:py-12 bg-white rounded-2xl mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Recent Searches</h2>
          <div className="space-y-4 md:max-w-2xl">
            <RecentSearchItem
              destination="Rome, Italy"
              dates="01 Nov - 06 Nov"
              guests="2 Guests"
            />
          </div>
        </section>

        {/* Fancy Discount Section */}
        <section className="px-6 py-8 md:py-12 bg-white rounded-2xl mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Fancy a discount?</h2>
          <p className="text-primary font-semibold mb-6 md:mb-8 text-sm md:text-base bg-primary/10 inline-block px-3 py-1 rounded-lg">
            Find the best deals!
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            <DiscountCard city="Barcelona" image={barcelonaImg} />
            <DiscountCard city="Sydney" image={sydneyImg} />
            <DiscountCard city="London" image={londonDiscountImg} />
            <DiscountCard city="Beijing" image={beijingImg} />
            <DiscountCard city="Mexico City" image={mexicoCityImg} />
          </div>
        </section>

        {/* Get Inspired Section */}
        <section className="px-6 py-8 md:py-12 md:pb-16 bg-white rounded-2xl mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Get inspired!</h2>
          <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
            Discover popular places for unforgettable adventures.
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            <InspiredCard city="London" image={londonImg} />
            <InspiredCard city="Berlin" image={berlinImg} />
            <InspiredCard city="Amsterdam" image={amsterdamImg} />
            <InspiredCard city="Rome" image={romeImg} />
            <InspiredCard city="Lisbon" image={lisbonImg} />
          </div>
        </section>
      </main>

      <div className="md:hidden">
        <BottomNavigation />
      </div>

      <McpInspector />
    </div>
  );
};

export default Index;
