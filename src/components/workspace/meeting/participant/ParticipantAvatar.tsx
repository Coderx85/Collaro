import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconUser } from "@tabler/icons-react";
import { User } from "lucide-react";

interface ParticipantAvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
}

const ParticipantAvatar = ({
  name,
  imageUrl,
  size = "md",
}: ParticipantAvatarProps) => {
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: "w-16 h-16 text-xl",
    md: "w-32 h-32 text-4xl",
    lg: "w-48 h-48 text-6xl",
  };

  const iconSizes = {
    sm: 32,
    md: 64,
    lg: 96,
  };

  const initials = getInitials(name);

  // Generate a consistent color based on name
  const getColorFromName = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 50%)`;
  };

  const backgroundColor = getColorFromName(name);

  if (imageUrl) {
    return (
      <Avatar className="rounded-lg w-full h-full justify-center items-center">
        <AvatarImage
          src={`https://multiavatar.com/${name}`}
          // alt={name}
          className={sizeClasses[size]}
        />
        <AvatarFallback className={sizeClasses[size]}>
          {initials}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full blur-2xl -translate-x-10 -translate-y-10" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-black rounded-full blur-2xl translate-x-12 translate-y-12" />
      </div>

      {/* Icon background (shown on hover) */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <IconUser className="text-white/60" size={iconSizes[size]} />
      </div>

      {/* Initials */}
      <span className="relative z-10 font-semibold tracking-wide">
        {initials}
      </span>
    </div>
  );
};

export default ParticipantAvatar;
