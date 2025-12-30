import { useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

interface AudioLevelIndicatorProps {
  audioLevel: number; // 0-1 range
  isMuted: boolean;
  isSpeaking: boolean;
}

const AudioLevelIndicator = ({
  audioLevel,
  isMuted,
  isSpeaking,
}: AudioLevelIndicatorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isMuted || !isSpeaking) {
      return;
    }

    // Draw audio level bars
    const barCount = 3;
    const barWidth = 2;
    const barGap = 2;
    const maxBarHeight = 12;

    for (let i = 0; i < barCount; i++) {
      const barHeight = Math.max(
        3,
        audioLevel * maxBarHeight * (0.7 + i * 0.15)
      );
      const x = i * (barWidth + barGap);
      const y = (maxBarHeight - barHeight) / 2;

      // Create gradient
      const gradient = ctx.createLinearGradient(x, 0, x, maxBarHeight);
      gradient.addColorStop(0, "#10b981");
      gradient.addColorStop(1, "#14b8a6");

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
    }
  }, [audioLevel, isMuted, isSpeaking]);

  return (
    <div className="flex items-center gap-1.5">
      {isMuted ? (
        <div className="p-1 rounded-full bg-red-500/20 border border-red-500/50">
          <MicOff className="w-3 h-3 text-red-400" />
        </div>
      ) : (
        <div className="p-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
          {isSpeaking ? (
            <canvas
              ref={canvasRef}
              width={12}
              height={12}
              className="w-3 h-3"
            />
          ) : (
            <Mic className="w-3 h-3 text-emerald-400" />
          )}
        </div>
      )}
    </div>
  );
};

export default AudioLevelIndicator;
