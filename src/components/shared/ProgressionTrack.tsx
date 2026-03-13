import { cn } from "@/lib/utils"

interface ProgressionTrackProps {
  currentLevel: number
  maxLevel?: number
  label: string
  color?: string
}

export function ProgressionTrack({ 
  currentLevel, 
  maxLevel = 9, 
  label,
  color = "bg-signal-intel"
}: ProgressionTrackProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-data font-bold text-text-muted uppercase tracking-widest">{label}</span>
        <span className="text-sm font-data font-bold text-text-primary">
          0{currentLevel} <span className="text-[10px] opacity-30">/ 0{maxLevel}</span>
        </span>
      </div>
      
      <div className="flex gap-1.5 h-1.5">
        {Array.from({ length: maxLevel }).map((_, i) => (
          <div 
            key={i}
            className={cn(
              "flex-1 rounded-full transition-all duration-500",
              i < currentLevel 
                ? `${color} shadow-[0_0_10px_rgba(0,176,255,0.3)]` 
                : "bg-white/5"
            )}
          />
        ))}
      </div>
      
      <div className="flex justify-between text-[8px] font-data text-text-dim uppercase">
        <span>Ideation</span>
        <span>Commercial</span>
      </div>
    </div>
  )
}
