import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/hooks/useUserProfile";
import profileImg from "@/assets/profile.jpg";
import profile2Img from "@/assets/profile2.jpg";
import profile3Img from "@/assets/profile3.jpg";
import profile4Img from "@/assets/profile4.jpg";
import profile5Img from "@/assets/profile5.jpg";

interface ProfileSelectorProps {
  currentProfile: UserProfile | null;
  availableProfiles: UserProfile[];
  onProfileSwitch: (profileId: string) => void;
  loading: boolean;
}

const PROFILE_AVATARS: Record<string, string> = {
  'Emma Rodriguez': profile2Img,
  'Alex Chen': profileImg,
  'Marco Silva': profile3Img,
  'Sophie Anderson': profile5Img,
  'Jake Murphy': profile5Img,
  'Priya Patel': profile4Img,
};

export const ProfileSelector = ({
  currentProfile,
  availableProfiles,
  onProfileSwitch,
  loading,
}: ProfileSelectorProps) => {
  const getAvatarForProfile = (name: string) => {
    return PROFILE_AVATARS[name] || profileImg;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  console.log('ProfileSelector render:', { 
    loading, 
    hasProfile: !!currentProfile, 
    profilesCount: availableProfiles.length 
  });

  if (loading || !currentProfile) {
    return (
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 animate-pulse" />
    );
  }

  // Show current profile only if no profiles available
  if (availableProfiles.length === 0) {
    return (
      <Avatar className="w-14 h-14 md:w-16 md:h-16 border-2 border-white">
        <AvatarImage 
          src={getAvatarForProfile(currentProfile.name)} 
          alt={currentProfile.name}
        />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {getInitials(currentProfile.name)}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-0 h-auto rounded-full hover:opacity-80 transition-opacity group"
          aria-label="Switch profile"
        >
          <Avatar className="w-14 h-14 md:w-16 md:h-16 border-2 border-white">
            <AvatarImage 
              src={getAvatarForProfile(currentProfile.name)} 
              alt={currentProfile.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(currentProfile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md group-hover:scale-110 transition-transform">
            <ChevronDown className="h-3 w-3 text-primary" />
          </div>
          {/* Debug badge - remove after testing */}
          {availableProfiles.length > 0 && (
            <div className="absolute -top-1 -left-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {availableProfiles.length}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2 bg-white dark:bg-card border shadow-lg z-[100]" align="end">
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
            Switch Profile ({availableProfiles.length} available)
          </div>
          {availableProfiles.length === 0 ? (
            <div className="px-3 py-4 text-sm text-muted-foreground text-center">
              No profiles available
            </div>
          ) : (
            availableProfiles.map((profile) => {
              const isActive = profile.id === currentProfile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => !isActive && onProfileSwitch(profile.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                  disabled={isActive}
                >
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage 
                      src={getAvatarForProfile(profile.name)} 
                      alt={profile.name}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-sm truncate">
                      {profile.name}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs mt-0.5"
                    >
                      {profile.travel_style}
                    </Badge>
                  </div>
                  {isActive && (
                    <Check className="h-4 w-4 flex-shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
