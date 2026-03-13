import { ProgressionTrack } from "./ProgressionTrack"
import { ExternalLink, Files, ShieldCheck, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    abstract: string | null
    current_stage: string
    innovation_category: string
    trl_level: number
    irl_level: number
    latest_viability_score: number | null
    latest_risk_score: number | null
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isAtRisk = (project.latest_risk_score ?? 0) > 60

  return (
    <div className="bg-surface border border-white/5 rounded-xl overflow-hidden group hover:border-white/10 transition-all">
      <div className="p-5 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-data text-signal-intel font-bold tracking-widest uppercase">
                {project.innovation_category}
              </span>
              {isAtRisk && (
                <div className="flex items-center gap-1 text-[9px] font-data text-signal-stagnant uppercase font-bold bg-signal-stagnant/10 px-1.5 py-0.5 rounded border border-signal-stagnant/20">
                  <AlertTriangle size={10} />
                  At_Risk
                </div>
              )}
            </div>
            <h3 className="text-lg font-interface font-black uppercase tracking-tight leading-tight group-hover:text-signal-intel transition-colors line-clamp-1">
              {project.title}
            </h3>
          </div>
          <Link 
            href={`/innovator/projects/${project.id}`}
            className="p-2 bg-background/50 rounded-lg hover:bg-signal-intel/20 hover:text-signal-intel transition-all translate-x-1 -translate-y-1"
          >
            <ExternalLink size={16} />
          </Link>
        </div>

        <p className="text-xs text-text-muted font-interface line-clamp-2 min-h-[32px] opacity-70 italic">
          "{project.abstract || 'No description provided.'}"
        </p>

        {/* Tracks */}
        <div className="grid grid-cols-2 gap-6 pt-2">
          <ProgressionTrack 
            label="Tech_Readiness (TRL)" 
            currentLevel={project.trl_level} 
            color="bg-signal-intel"
          />
          <ProgressionTrack 
            label="Market_Readiness (IRL)" 
            currentLevel={project.irl_level} 
            color="bg-signal-healthy"
          />
        </div>

        {/* Footer Metrics */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-data">
              <span className="text-[9px] text-text-muted uppercase">Viability</span>
              <span className="text-xs font-bold text-signal-healthy">{project.latest_viability_score ?? '??'}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Files size={12} className="text-text-dim" />
              <span className="text-[10px] font-data text-text-dim uppercase">03_Docs</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-signal-healthy" />
            <span className="text-[10px] font-data text-text-muted uppercase">Stage: {project.current_stage}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
