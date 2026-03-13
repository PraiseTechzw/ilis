import { getEvaluatorAssignments } from "@/services/evaluation"
import { ClipboardCheck, ArrowRight, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default async function EvaluatorDashboardPage() {
  const assignments = await getEvaluatorAssignments()

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-signal-healthy/20 rounded border border-signal-healthy/30 text-signal-healthy">
              <ClipboardCheck size={24} />
            </div>
            <h1 className="text-4xl font-interface font-black tracking-tight uppercase">
               Expert <span className="text-signal-healthy">Review</span> _Terminal
            </h1>
          </div>
          <p className="text-text-muted font-interface text-sm max-w-2xl">
            Quantitative assessment of innovation nodes. Your evaluations drive the institutional triage engine and resource allocation.
          </p>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-1">
           <Clock size={16} className="text-signal-healthy" />
           <span className="text-xs font-data font-bold tracking-[0.3em] uppercase text-text-muted">
             Assigned_Evaluation_Queue
           </span>
        </div>

        {assignments.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-white/5 rounded-3xl bg-surface/30">
            <div className="p-6 bg-white/5 rounded-full text-text-dim">
              <ClipboardCheck size={48} />
            </div>
            <div className="space-y-1">
              <h3 className="font-interface font-bold text-lg uppercase">No_Pending_Reviews</h3>
              <p className="text-sm text-text-muted font-interface">All assigned project nodes have been processed or no assignments exist.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((evalItem) => (
              <div key={evalItem.id} className="bg-surface border border-white/5 rounded-2xl p-6 group hover:border-signal-healthy/30 transition-all">
                <div className="flex justify-between items-start mb-6">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-data text-signal-healthy font-bold tracking-widest uppercase">
                          {evalItem.project.innovation_category}
                        </span>
                        <div className={cn(
                          "px-1.5 py-0.5 rounded text-[8px] font-data font-bold uppercase",
                          evalItem.status === 'PENDING' ? "bg-signal-stagnant/10 text-signal-stagnant" : "bg-signal-healthy/10 text-signal-healthy"
                        )}>
                          {evalItem.status}
                        </div>
                      </div>
                      <h3 className="text-lg font-interface font-black uppercase tracking-tight group-hover:text-signal-healthy transition-colors">
                        {evalItem.project.title}
                      </h3>
                   </div>
                   <Link href={`/evaluator/evaluate/${evalItem.id}`}>
                      <button className="p-3 bg-white/5 rounded-xl hover:bg-signal-healthy/20 hover:text-signal-healthy transition-all">
                        <ArrowRight size={20} />
                      </button>
                   </Link>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                   <div className="space-y-1">
                      <span className="text-[9px] font-data text-text-dim uppercase">TRL_Level</span>
                      <div className="text-sm font-data font-bold text-text-primary">0{evalItem.project.trl_level}</div>
                   </div>
                   <div className="space-y-1">
                      <span className="text-[9px] font-data text-text-dim uppercase">Assigned_On</span>
                      <div className="text-[10px] font-data text-text-primary uppercase tracking-tighter">
                        {new Date(evalItem.created_at).toLocaleDateString()}
                      </div>
                   </div>
                   <div className="space-y-1 text-right">
                      <span className="text-[9px] font-data text-text-dim uppercase">Score</span>
                      <div className="text-sm font-data font-bold text-signal-healthy">
                        {evalItem.overall_score ? `${evalItem.overall_score}%` : '---'}
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
