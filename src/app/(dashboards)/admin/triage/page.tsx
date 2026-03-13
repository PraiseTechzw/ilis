import { getTriageQueue } from "@/services/admin"
import { Clock, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function TriageQueuePage() {
  const triage = await getTriageQueue()

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-2 text-[10px] font-data font-bold text-text-muted hover:text-signal-intel transition-colors uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={14} />
            Back_to_Executive_Intel
          </Link>
          <h1 className="text-4xl font-interface font-black uppercase tracking-tight">
            Triage <span className="text-signal-intel">Control</span>
          </h1>
        </div>
        <div className="bg-surface/50 border border-white/5 px-6 py-3 rounded-xl flex items-center gap-3">
          <Clock size={18} className="text-signal-intel animate-pulse" />
          <span className="text-xs font-data font-bold text-text-muted uppercase tracking-widest">{triage.length}_Nodes_Pending</span>
        </div>
      </div>

      <div className="bg-surface/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="p-6 text-[10px] font-data text-text-dim uppercase tracking-widest">Project_Node</th>
              <th className="p-6 text-[10px] font-data text-text-dim uppercase tracking-widest">Submission_Metadata</th>
              <th className="p-6 text-[10px] font-data text-text-dim uppercase tracking-widest text-center">TRL_Status</th>
              <th className="p-6 text-[10px] font-data text-text-dim uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {triage.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center font-data text-xs text-text-dim uppercase italic">
                  Queue_Status: Nominal // No_Pending_Requests_Detected
                </td>
              </tr>
            ) : (
              triage.map((proj) => (
                <tr key={proj.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-6">
                    <div className="text-lg font-bold uppercase tracking-tight group-hover:text-signal-intel transition-colors">
                      {proj.title}
                    </div>
                    <div className="text-[10px] font-data text-text-dim uppercase mt-1">{proj.innovation_category} // {proj.id}</div>
                  </td>
                  <td className="p-6">
                    <div className="text-sm font-interface font-bold text-text-primary">{proj.pi?.first_name} {proj.pi?.last_name}</div>
                    <div className="text-[10px] font-data text-text-muted uppercase">{proj.pi?.email}</div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-block px-4 py-1.5 rounded bg-signal-intel/10 border border-signal-intel/30 text-signal-intel font-data font-black text-sm">
                      LVL_0{proj.trl_level}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <Link href={`/admin/triage/${proj.id}`}>
                      <button className="bg-signal-intel/10 hover:bg-signal-intel text-signal-intel hover:text-background px-6 py-2 rounded-lg font-data font-bold text-[10px] uppercase tracking-widest transition-all border border-signal-intel/20">
                        Begin_Review
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
  )
}
