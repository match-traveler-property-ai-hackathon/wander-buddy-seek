import { Card } from "@/components/ui/card";

interface DiscountCardProps {
  city: string;
  image: string;
}

export const DiscountCard = ({ city, image }: DiscountCardProps) => {
  return (
    <Card className="relative overflow-hidden min-w-[320px] h-[240px] rounded-3xl border-0 shadow-[var(--shadow-card)]">
      <img
        src={image}
        alt={city}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-6 left-6">
        <h3 className="text-white font-bold text-3xl">{city}</h3>
      </div>
    </Card>
  );
};
