import { cn } from "@/lib/utils"

interface StageMetric {
  current_stage: string
  project_count: number
  avg_trl: number
  avg_viability: number
}

interface HeatmapProps {
  metrics: StageMetric[]
}

const STAGES = [
  'INTAKE',
  'TRIAGE',
  'EVALUATION',
  'MENTORSHIP',
  'PILOT',
  'COMMERCIALIZATION'
]

export function ProjectHeatmap({ metrics }: HeatmapProps) {
  const getMetric = (stage: string) => metrics.find(m => m.current_stage === stage)

  return (
    <div className="bg-surface/30 border border-white/5 rounded-2xl p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-data font-bold uppercase tracking-widest text-text-muted">
          Pipeline_Density_Heatmap
        </h3>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-signal-intel" />
              <span className="text-[9px] font-data text-text-dim uppercase">High_Density</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/5" />
              <span className="text-[9px] font-data text-text-dim uppercase">Empty</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STAGES.map((stage) => {
          const data = getMetric(stage)
          const count = data?.project_count || 0
          
          return (
            <div 
              key={stage}
              className={cn(
                "relative h-32 rounded-xl border transition-all duration-500 overflow-hidden flex flex-col items-center justify-center gap-2 p-4 group",
                count > 0 
                  ? "bg-signal-intel/10 border-signal-intel/30 border-dashed" 
                  : "bg-white/5 border-white/5"
              )}
            >
              {/* Glow Effect for active stages */}
              {count > 0 && (
                <div className="absolute inset-0 bg-signal-intel/5 animate-pulse" />
              )}
              
              <div className="text-[9px] font-data font-black text-text-dim group-hover:text-signal-intel transition-colors uppercase tracking-tighter text-center">
                {stage.replace('_', ' ')}
              </div>
              
              <div className="text-3xl font-data font-bold text-text-primary z-10">
                {count.toString().padStart(2, '0')}
              </div>

              {count > 0 && (
                <div className="text-[8px] font-data text-signal-healthy uppercase tracking-widest z-10">
                  Avg_TRL: {Number(data?.avg_trl).toFixed(1)}
                </div>
              )}

              {/* Intensity Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                 <div 
                  className="h-full bg-signal-intel" 
                  style={{ width: `${Math.min((count / 20) * 100, 100)}%` }}
                 />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
