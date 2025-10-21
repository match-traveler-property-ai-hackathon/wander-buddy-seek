import { useState, useEffect, useRef, useMemo } from "react";
import { SearchWidget } from "@/components/SearchWidget";
import { TravelPlanCard } from "@/components/TravelPlanCard";
import { RecentSearchItem } from "@/components/RecentSearchItem";
import { DiscountCard } from "@/components/DiscountCard";
import { InspiredCard } from "@/components/InspiredCard";
import { HostelCard } from "@/components/HostelCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { ProfileSelector } from "@/components/ProfileSelector";
import { FiltersModal, FilterOptions } from "@/components/FiltersModal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Search, Loader2, ChevronLeft, ChevronRight, Sparkles, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMcpHostelSearch } from "@/hooks/useMcpHostelSearch";
import { useUserProfile } from "@/hooks/useUserProfile";
import { buildProfileQuery } from "@/utils/profileQuery";
import { McpInspector } from "@/components/McpInspector";
import { useIsMobile } from "@/hooks/use-mobile";
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
import hostelworldLogo from "@/assets/hostelworld-logo.png";

const Index = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isFirstProfileLoad, setIsFirstProfileLoad] = useState(true);
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
    mcpResponse
  } = useMcpHostelSearch();
  const { 
    profile, 
    loading: profileLoading, 
    availableProfiles, 
    switchProfile 
  } = useUserProfile();

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

  // Process MCP response and map to hostel card format
  const displayHostels = useMemo(() => {
    console.log('MCP Response:', mcpResponse);
    console.log('Hostels from response:', mcpResponse?.structuredContent?.results?.[0]?.hostels);
    
    const mapped = mcpResponse?.structuredContent?.results?.[0]?.hostels?.map((hostel: any) => {
      console.log('Mapping hostel:', hostel.name, hostel);
      return {
        id: hostel.id,
        name: hostel.name,
        price: parseFloat(hostel.lowestPricePerNight?.value || '0'),
        image: hostel.images?.[0] ? `https://${hostel.images[0].prefix}${hostel.images[0].suffix}` : hostel1Img,
        rating: hostel.overallRating?.overall ? hostel.overallRating.overall / 10 : 4.5,
        benefits: hostel.facilities?.slice(0, 3).flatMap((category: any) => 
          category.facilities?.slice(0, 1).map((facility: any) => facility.name) || []
        ).filter(Boolean).slice(0, 3) || ["Free WiFi"],
        bookingLink: hostel.bookingLink,
        distance: hostel.distance?.value ? `${hostel.distance.value} ${hostel.distance.units} from centre` : undefined
      };
    }) || defaultHostels;
    
    console.log('Mapped displayHostels:', mapped);
    return mapped;
  }, [mcpResponse]);

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

  // Mark initial load as complete without searching
  useEffect(() => {
    if (!profileLoading && profile && !initialLoadComplete) {
      setInitialLoadComplete(true);
    }
  }, [profile, profileLoading, initialLoadComplete]);

  // Re-fetch recommendations when profile changes (but not on initial load)
  useEffect(() => {
    if (profile && !profileLoading && initialLoadComplete) {
      if (isFirstProfileLoad) {
        // Skip search on first profile load
        setIsFirstProfileLoad(false);
      } else {
        // Only search when user actively switches profiles
        performProfileSearch();
        toast({
          title: "Profile switched",
          description: `Now showing recommendations for ${profile.name}`,
        });
      }
    }
  }, [profile?.id]);

  const performProfileSearch = async () => {
    if (!profile) return;

    const query = buildProfileQuery(profile);
    console.log('Performing profile-based search:', query);

    try {
      const result = await searchHostels(query, true); // true = profile-based
      
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: `Found results based on your preferences.`,
        });
      } else {
        console.log(result.message || 'No results');
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
          description: result.message || "Found results matching your criteria",
        });
      } else {
        toast({
          title: result.rateLimited ? "Rate limit exceeded" : "No results found",
          description: result.message || "Try adjusting your search criteria",
          variant: result.rateLimited ? "destructive" : "default",
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
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-4">
                  <img 
                    src={hostelworldLogo} 
                    alt="Hostelworld" 
                    className="w-10 h-10 md:w-12 md:h-12"
                  />
                  <h1 className="text-white text-2xl md:text-4xl font-bold">
                    Meet your people.
                  </h1>
                </div>
                <DesktopNavigation />
              </div>
            </div>
            <ProfileSelector
              currentProfile={profile}
              availableProfiles={availableProfiles}
              onProfileSwitch={switchProfile}
              loading={profileLoading}
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
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold">Your Recommendations</h2>
              <Building2 className="h-6 w-6 md:h-7 md:w-7 text-primary" />
            </div>
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
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold">Ask AI</h2>
              <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm md:text-base">
              Tell us what you're looking for
            </p>
          </div>
          
          <div className="max-w-2xl space-y-3 md:space-y-0 mb-4">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Describe your stay"
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
          
          <div className="flex flex-col md:flex-row gap-2 md:overflow-x-auto pb-4 md:-mx-6 md:px-6 scrollbar-hide">
            <button 
              onClick={() => {
                const query = "Find me a hostel for tonight nearby";
                setSearchQuery(query);
                handleSearch(query);
              }}
              disabled={isSearching}
              className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50 overflow-x-auto"
            >
              <span className="whitespace-nowrap">Find me a hostel for tonight nearby</span>
            </button>
            <button 
              onClick={() => {
                const query = "Social and pet-friendly hostels in Mexico City";
                setSearchQuery(query);
                handleSearch(query);
              }}
              disabled={isSearching}
              className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50 overflow-x-auto"
            >
              <span className="whitespace-nowrap">Social and pet-friendly hostels in Mexico City</span>
            </button>
            <button 
              onClick={() => {
                const query = "Hostels on the mediterranean";
                setSearchQuery(query);
                handleSearch(query);
              }}
              disabled={isSearching}
              className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50 overflow-x-auto"
            >
              <span className="whitespace-nowrap">Hostels on the mediterranean</span>
            </button>
          </div>

          {/* MCP Search Results Display */}
          {mcpResponse && (() => {
            // Use the same mapped hostels from displayHostels (filter out defaults)
            const searchResults = mcpResponse?.structuredContent?.results?.[0]?.hostels ? displayHostels : [];

            return (
              <div className="mt-8 space-y-8">
                {/* Carousel Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Search Results
                  </h3>
                  {searchResults.length > 0 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {searchResults.map((hostel, index) => (
                          <CarouselItem key={hostel.id || index} className="md:basis-1/2 lg:basis-1/3">
                            <HostelCard
                              name={hostel.name}
                              image={hostel.image}
                              rating={hostel.rating}
                              distance={hostel.distance}
                              price={hostel.price}
                              benefits={hostel.benefits}
                              bookingLink={hostel.bookingLink}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  ) : (
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">No hostels found. Try adjusting your search.</p>
                    </div>
                  )}
                </div>

                {/* Mapped Array Section */}
                {searchResults.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Mapped Carousel Data
                    </h3>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-foreground whitespace-pre-wrap">
                        {JSON.stringify(searchResults, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Frontend Mapping Result Section */}
                {searchResults.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Frontend Mapping Result
                    </h3>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-foreground whitespace-pre-wrap">
                        {JSON.stringify({
                          propertyType: searchResults.map(hostel => ({
                            id: hostel.id,
                            name: hostel.name,
                            price: hostel.price,
                            image: hostel.image,
                            facilities: hostel.benefits,
                            bookingLink: hostel.bookingLink,
                            rating: hostel.rating,
                            distance: hostel.distance
                          }))
                        }, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Raw MCP Response Section - Only hostels */}
                {searchResults.length > 0 && mcpResponse?.structuredContent?.results?.[0]?.hostels && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Raw MCP Server Response
                    </h3>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-foreground whitespace-pre-wrap">
                        {JSON.stringify(mcpResponse.structuredContent.results[0].hostels, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
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
