import { getAdminPipelineStats, getProjectStageMetrics, getTriageQueue } from "@/services/admin"
import { ProjectHeatmap } from "@/components/admin/Heatmap"
import { Shield, Activity, Users, Zap, ArrowRight, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  const stats = await getAdminPipelineStats()
  const metrics = await getProjectStageMetrics()
  const triage = await getTriageQueue()

  return (
    <div className="space-y-10">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-signal-intel/20 rounded border border-signal-intel/30 text-signal-intel">
              <Shield size={24} />
            </div>
            <h1 className="text-4xl font-interface font-black tracking-tight uppercase">
               Executive <span className="text-signal-intel">Intelligence</span> _v2
            </h1>
          </div>
          <p className="text-text-muted font-interface text-sm max-w-2xl">
            Real-time institutional oversight across the innovation lifecycle. Algorithmic velocity tracking and pipeline health diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-surface border border-white/5 p-2 rounded-xl">
           <div className="px-4 py-2 border-r border-white/5 flex flex-col items-end">
              <span className="text-[9px] font-data text-text-dim uppercase">Sync_Status</span>
              <span className="text-[10px] font-data text-signal-healthy uppercase tracking-tighter flex items-center gap-1">
                 <div className="w-1 h-1 rounded-full bg-signal-healthy animate-ping" />
                 Live_Grid
              </span>
           </div>
           <Button className="bg-signal-intel font-bold text-background uppercase text-[10px] tracking-widest px-6">
              Export_Report
           </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard 
            label="Total_IP_Nodes" 
            value={stats?.total_projects || 0} 
            icon={<Shield size={20} />} 
            trend="+04 this month"
         />
         <StatCard 
            label="Active_Innovators" 
            value={stats?.active_innovators || 0} 
            icon={<Users size={20} />} 
            color="text-signal-healthy"
         />
         <StatCard 
            label="Pipeline_Velocity" 
            value={`${Number(stats?.avg_pipeline_velocity || 0).toFixed(1)} TRL`} 
            icon={<Zap size={20} />} 
            color="text-signal-intel"
         />
         <StatCard 
            label="Risk_Alerts" 
            value={stats?.projects_at_risk || 0} 
            icon={<Activity size={20} />} 
            color="text-signal-stagnant"
            alert={Number(stats?.projects_at_risk || 0) > 0}
         />
      </div>

      {/* Heatmap Section */}
      <ProjectHeatmap metrics={metrics} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         {/* Triage Queue */}
         <div className="xl:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-1">
               <div className="flex items-center gap-3">
                  <Clock size={16} className="text-signal-intel" />
                  <span className="text-xs font-data font-bold tracking-[0.3em] uppercase text-text-muted">
                    Immediate_Triage_Required
                  </span>
               </div>
               <Link href="/admin/triage" className="text-[10px] font-data text-signal-intel hover:underline uppercase tracking-widest">
                  View_Full_Queue
               </Link>
            </div>

            <div className="bg-surface/50 border border-white/5 rounded-2xl overflow-hidden">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                       <th className="p-4 text-[10px] font-data text-text-dim uppercase tracking-widest">Project_Node</th>
                       <th className="p-4 text-[10px] font-data text-text-dim uppercase tracking-widest">Lead_Innovator</th>
                       <th className="p-4 text-[10px] font-data text-text-dim uppercase tracking-widest text-center">TRL</th>
                       <th className="p-4 text-[10px] font-data text-text-dim uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {triage.length === 0 ? (
                       <tr>
                          <td colSpan={4} className="p-10 text-center font-data text-[10px] text-text-dim uppercase italic">
                             Queue_Empty // No_Pending_Triage
                          </td>
                       </tr>
                    ) : (
                       triage.map((proj) => (
                         <tr key={proj.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                           <td className="p-4">
                              <div className="text-sm font-bold uppercase tracking-tight group-hover:text-signal-intel transition-colors">
                                 {proj.title}
                              </div>
                              <div className="text-[9px] font-data text-text-dim uppercase">{proj.innovation_category}</div>
                           </td>
                           <td className="p-4">
                              <div className="text-xs font-interface">{proj.pi?.first_name} {proj.pi?.last_name}</div>
                              <div className="text-[9px] font-data text-text-dim">{proj.pi?.email}</div>
                           </td>
                           <td className="p-4 text-center">
                              <div className="inline-block px-2 py-1 rounded bg-signal-intel/10 border border-signal-intel/20 text-signal-intel font-data font-bold text-xs mt-1">
                                 0{proj.trl_level}
                              </div>
                           </td>
                           <td className="p-4 text-right">
                              <Link href={`/admin/triage/${proj.id}`}>
                                 <button className="p-2 hover:bg-signal-intel/20 rounded-lg text-text-muted hover:text-signal-intel transition-all">
                                    <ArrowRight size={18} />
                                 </button>
                              </Link>
                           </td>
                         </tr>
                       ))
                    )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* System Events */}
         <div className="xl:col-span-4 space-y-6">
            <div className="flex items-center gap-3 px-1">
               <Activity size={16} className="text-signal-intel" />
               <span className="text-xs font-data font-bold tracking-[0.3em] uppercase text-text-muted">
                 Global_Events
               </span>
            </div>
            
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="bg-surface/30 p-4 border-l-2 border-signal-intel rounded-r-xl space-y-2">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-data text-signal-intel uppercase">New_Submission</span>
                       <span className="text-[8px] font-data text-text-dim uppercase">2m ago</span>
                    </div>
                    <p className="text-xs font-interface leading-relaxed opacity-80">
                       Project "Quantum_Ledger" successfully initialized in the <span className="text-signal-healthy px-1">Intake</span> stage.
                    </p>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, trend, color = "text-text-primary", alert = false }: any) {
   return (
      <div className={cn(
         "bg-surface border p-6 rounded-2xl space-y-4 relative overflow-hidden group hover:border-white/10 transition-all",
         alert ? "border-signal-stagnant/30" : "border-white/5"
      )}>
         {alert && <div className="absolute top-0 right-0 w-16 h-16 bg-signal-stagnant/5 blur-2xl rounded-full" />}
         
         <div className="flex justify-between items-start">
            <div className="p-2 bg-white/5 rounded-lg text-text-muted group-hover:text-text-primary transition-colors">
               {icon}
            </div>
            {trend && <span className="text-[9px] font-data text-signal-healthy uppercase">{trend}</span>}
         </div>

         <div>
            <div className="text-[10px] font-data text-text-muted uppercase tracking-widest">{label}</div>
            <div className={cn("text-3xl font-data font-black mt-1", color)}>{value}</div>
         </div>
      </div>
   )
}
