import type { ParticipantRole } from "@/action/participant.actions";
import { Crown, Shield, User } from "lucide-react";

interface ParticipantBadgeProps {
  role: ParticipantRole;
  name: string;
  className?: string;
}

const ParticipantBadge = ({
  role,
  name,
  className = "",
}: ParticipantBadgeProps) => {
  const getRoleConfig = () => {
    switch (role) {
      case "owner":
        return {
          icon: Crown,
          label: "Owner",
          bgColor: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20",
          borderColor: "border-amber-500/50",
          textColor: "text-amber-400",
          iconColor: "text-amber-400",
        };
      case "admin":
        return {
          icon: Shield,
          label: "Admin",
          bgColor: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
          borderColor: "border-blue-500/50",
          textColor: "text-blue-400",
          iconColor: "text-blue-400",
        };
      case "member":
      default:
        return {
          icon: User,
          label: "Member",
          bgColor: "bg-gradient-to-r from-slate-600/20 to-slate-500/20",
          borderColor: "border-slate-500/50",
          textColor: "text-slate-300",
          iconColor: "text-slate-400",
        };
    }
  };

  const config = getRoleConfig();
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm
        ${config.bgColor} ${config.borderColor} border ${className}`}
    >
      <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
      <div className="flex flex-col">
        <span
          className={`text-xs font-semibold ${config.textColor} leading-tight`}
        >
          {name}
        </span>
        <span className="text-[10px] text-slate-400 leading-tight">
          {config.label}
        </span>
      </div>
    </div>
  );
};

export default ParticipantBadge;
