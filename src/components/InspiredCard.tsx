import { Card } from "@/components/ui/card";

interface InspiredCardProps {
  city: string;
  image: string;
}

export const InspiredCard = ({ city, image }: InspiredCardProps) => {
  return (
    <Card className="relative overflow-hidden min-w-[280px] h-[360px] rounded-3xl border-0 shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer">
      <img
        src={image}
        alt={city}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-6">
        <h3 className="text-white font-bold text-2xl">{city}</h3>
      </div>
    </Card>
  );
};
