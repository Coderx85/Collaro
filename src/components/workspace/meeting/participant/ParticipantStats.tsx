"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Activity, Signal, Wifi } from "lucide-react";

interface ParticipantStatsProps {
  connectionQuality?: string;
  bitrate?: number;
  latency?: number;
  packetLoss?: number;
  children: React.ReactNode;
}

const ParticipantStats = ({
  connectionQuality = "good",
  bitrate,
  latency,
  packetLoss,
  children,
}: ParticipantStatsProps) => {
  const formatBitrate = (bps?: number): string => {
    if (!bps) return "N/A";
    if (bps >= 1000000) {
      return `${(bps / 1000000).toFixed(1)} Mbps`;
    }
    return `${(bps / 1000).toFixed(0)} Kbps`;
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case "excellent":
        return "text-emerald-400";
      case "good":
        return "text-blue-400";
      case "poor":
        return "text-yellow-400";
      case "bad":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-slate-900/95 border border-slate-700 p-3 backdrop-blur-sm"
        >
          <div className="space-y-2 min-w-[200px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <span className="text-xs font-semibold text-slate-300">
                Connection Stats
              </span>
              <Signal
                className={`w-4 h-4 ${getQualityColor(connectionQuality)}`}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Wifi className="w-3 h-3" />
                  Quality
                </span>
                <span
                  className={`text-xs font-medium ${getQualityColor(connectionQuality)}`}
                >
                  {connectionQuality.charAt(0).toUpperCase() +
                    connectionQuality.slice(1)}
                </span>
              </div>

              {bitrate !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Activity className="w-3 h-3" />
                    Bitrate
                  </span>
                  <span className="text-xs font-medium text-slate-200">
                    {formatBitrate(bitrate)}
                  </span>
                </div>
              )}

              {latency !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Latency</span>
                  <span className="text-xs font-medium text-slate-200">
                    {latency}ms
                  </span>
                </div>
              )}

              {packetLoss !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Packet Loss</span>
                  <span
                    className={`text-xs font-medium ${
                      packetLoss > 5 ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {packetLoss.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ParticipantStats;
