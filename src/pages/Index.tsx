import { SearchWidget } from "@/components/SearchWidget";
import { TravelPlanCard } from "@/components/TravelPlanCard";
import { RecentSearchItem } from "@/components/RecentSearchItem";
import { DiscountCard } from "@/components/DiscountCard";
import { InspiredCard } from "@/components/InspiredCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Badge } from "@/components/ui/badge";
import barcelonaImg from "@/assets/barcelona.jpg";
import sydneyImg from "@/assets/sydney.jpg";
import londonImg from "@/assets/london.jpg";
import berlinImg from "@/assets/berlin.jpg";
import londonDiscountImg from "@/assets/london-discount.jpg";
import beijingImg from "@/assets/beijing.jpg";
import mexicoCityImg from "@/assets/mexico-city.jpg";
import profileImg from "@/assets/profile.jpg";
import profile2Img from "@/assets/profile2.jpg";
import profile3Img from "@/assets/profile3.jpg";
import profile4Img from "@/assets/profile4.jpg";
import profile5Img from "@/assets/profile5.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-br from-primary via-primary to-primary-light px-6 pt-12 pb-8">
        <div className="max-w-[480px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-2xl font-bold max-w-[250px]">
              Your next adventure starts here!
            </h1>
            <img
              src={profileImg}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover border-2 border-white"
            />
          </div>
          <SearchWidget />
        </div>
      </header>

      <main className="max-w-[480px] mx-auto">
        {/* Travel Plans Section */}
        <section className="px-6 py-8 bg-white rounded-t-[2rem] -mt-6 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-bold">Travel Plans</h2>
            <Badge className="bg-primary text-white hover:bg-primary rounded-full px-3 py-1 text-xs font-bold">
              NEW!
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
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
          <button className="text-primary font-semibold mt-4 text-sm">See all</button>
        </section>

        {/* Recent Searches Section */}
        <section className="px-6 py-8">
          <h2 className="text-2xl font-bold mb-6">Recent Searches</h2>
          <div className="space-y-4">
            <RecentSearchItem
              destination="Rome, Italy"
              dates="01 Nov - 06 Nov"
              guests="2 Guests"
            />
          </div>
        </section>

        {/* Fancy Discount Section */}
        <section className="px-6 py-8">
          <h2 className="text-2xl font-bold mb-2">Fancy a discount?</h2>
          <p className="text-primary font-semibold mb-6 text-sm bg-primary/10 inline-block px-3 py-1 rounded-lg">
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
        <section className="px-6 py-8">
          <h2 className="text-2xl font-bold mb-2">Get inspired!</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Discover popular places for unforgettable adventures.
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            <InspiredCard city="London" image={londonImg} />
            <InspiredCard city="Berlin" image={berlinImg} />
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Index;
