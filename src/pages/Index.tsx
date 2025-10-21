import { useState, useEffect } from "react";
import { SearchWidget } from "@/components/SearchWidget";
import { TravelPlanCard } from "@/components/TravelPlanCard";
import { RecentSearchItem } from "@/components/RecentSearchItem";
import { DiscountCard } from "@/components/DiscountCard";
import { InspiredCard } from "@/components/InspiredCard";
import { HostelCard } from "@/components/HostelCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMcpHostelSearch } from "@/hooks/useMcpHostelSearch";
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
  const { 
    searchHostels, 
    isSearching, 
    hostels: mcpHostels
  } = useMcpHostelSearch();

  // Default hostels to display initially
  const defaultHostels = [
    {
      name: "Casa Pepe",
      image: hostel1Img,
      rating: 4.8,
      distance: "1.2 km from centre",
      price: 25,
      benefits: ["Pet-friendly", "Social", "Free WiFi"]
    },
    {
      name: "Mexico City Rooftop",
      image: hostel2Img,
      rating: 4.9,
      distance: "0.8 km from centre",
      price: 32,
      benefits: ["Pet-friendly", "Rooftop terrace", "Kitchen"]
    },
    {
      name: "La Casa Colorida",
      image: hostel3Img,
      rating: 4.7,
      distance: "1.5 km from centre",
      price: 28,
      benefits: ["Pet-friendly", "Social", "Bar"]
    },
    {
      name: "Green Garden Hostel",
      image: hostel4Img,
      rating: 4.9,
      distance: "2.1 km from centre",
      price: 30,
      benefits: ["Pet-friendly", "Eco-friendly", "Garden"]
    },
    {
      name: "Colonial Charm",
      image: hostel5Img,
      rating: 4.6,
      distance: "1.8 km from centre",
      price: 27,
      benefits: ["Pet-friendly", "Historic building", "Courtyard"]
    }
  ];

  const displayHostels = mcpHostels.length > 0 ? mcpHostels : defaultHostels;

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
      const result = await searchHostels(query);

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
        <section className="px-6 py-8 md:py-12 bg-white rounded-t-[2rem] -mt-6 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Hostels just for you</h2>
          <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
            Social and pet-friendly hostels in Mexico City
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide mb-6 md:mb-8">
            {displayHostels.map((hostel, index) => (
              <HostelCard
                key={index}
                name={hostel.name}
                image={hostel.image}
                rating={hostel.rating}
                distance={hostel.distance}
                price={hostel.price}
                benefits={hostel.benefits}
              />
            ))}
          </div>
          
          <div className="mt-6 md:mt-8">
            <div className="relative mb-4 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="describe your ideal hostel features and location"
                className="pl-9 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
              )}
            </div>
            <div className="flex flex-wrap gap-2 max-w-2xl">
              <button 
                onClick={() => {
                  const query = "Find me a hostel for tonight nearby";
                  setSearchQuery(query);
                  handleSearch(query);
                }}
                disabled={isSearching}
                className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50"
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
                className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50"
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
                className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                Hostels on the mediterranean with a surf school nearby
              </button>
            </div>
          </div>
        </section>

        {/* Travel Plans Section */}
        <section className="px-6 py-8 md:py-12">
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
        <section className="px-6 py-8 md:py-12">
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
        <section className="px-6 py-8 md:py-12">
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
        <section className="px-6 py-8 md:py-12 md:pb-16">
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
    </div>
  );
};

export default Index;
