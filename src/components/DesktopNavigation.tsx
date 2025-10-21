import { useState } from "react";
import { Menu, Search, Backpack, MessageCircle, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon, label, active }: NavItemProps) => {
  return (
    <button
      className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-colors ${
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-foreground hover:bg-muted"
      }`}
    >
      <div className="flex items-center justify-center w-6">
        {icon}
      </div>
      <span className="text-base">{label}</span>
    </button>
  );
};

export const DesktopNavigation = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="hidden md:block">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 hover:text-white"
          >
            <Menu size={28} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="text-left text-xl">Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-2 mt-8">
            <NavItem icon={<Search size={24} />} label="Explore" active />
            <NavItem icon={<Backpack size={24} />} label="Trips" />
            <NavItem icon={<MessageCircle size={24} />} label="Chat" />
            <NavItem icon={<Calendar size={24} />} label="Events" />
            <NavItem icon={<User size={24} />} label="Profile" />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};
