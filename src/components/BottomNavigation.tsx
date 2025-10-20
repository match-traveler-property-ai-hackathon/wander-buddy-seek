import { Search, Backpack, MessageCircle, Calendar, User } from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon, label, active }: NavItemProps) => {
  return (
    <button
      className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      <div className={active ? "bg-primary/10 p-2 rounded-full" : "p-2"}>
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border py-2 px-4 max-w-[480px] mx-auto">
      <div className="flex justify-around items-center">
        <NavItem icon={<Search size={24} />} label="Explore" active />
        <NavItem icon={<Backpack size={24} />} label="Trips" />
        <NavItem icon={<MessageCircle size={24} />} label="Chat" />
        <NavItem icon={<Calendar size={24} />} label="Events" />
        <NavItem icon={<User size={24} />} label="Profile" />
      </div>
    </nav>
  );
};
