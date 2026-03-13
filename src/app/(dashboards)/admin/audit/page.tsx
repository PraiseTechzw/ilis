import { getGlobalAuditLogs } from "@/services/admin"
import { Activity, ArrowLeft, User } from "lucide-react"
import Link from "next/link"

export default async function AuditLogsPage() {
  const logs = await getGlobalAuditLogs()

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <Link 
          href="/admin" 
          className="flex items-center gap-2 text-[10px] font-data font-bold text-text-muted hover:text-signal-intel transition-colors uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={14} />
          Back_to_Executive_Intel
        </Link>
        <h1 className="text-4xl font-interface font-black uppercase tracking-tight">
          System <span className="text-signal-intel">Audit</span> _Trail
        </h1>
      </div>

      <div className="bg-surface/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="p-6 text-[10px] font-data text-text-dim uppercase tracking-widest">Timestamp</th>
              <th className="p-6 text-[10px] font-data text-text-dim uppercase tracking-widest">Project_Node</th>
              <th className="p-6 text-[10px] font-data text-text-dim uppercase tracking-widest">Transition</th>
              <th className="p-6 text-[10px] font-data text-text-dim uppercase tracking-widest text-right">Authorized_By</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center font-data text-xs text-text-dim uppercase italic">
                  Audit_Status: Clean // No_Event_History_Detected
                </td>
              </tr>
            ) : (
              logs.map((log: any) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <div className="text-xs font-data text-text- primary font-bold">
                       {new Date(log.changed_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="text-sm font-interface font-bold text-signal-intel uppercase tracking-tight">
                       {log.project?.title}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-[10px] font-data uppercase">
                       <span className="text-text-muted">{log.old_stage || 'INITIAL'}</span>
                       <span className="text-signal-intel">→</span>
                       <span className="text-text-primary font-bold">{log.new_stage}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <div className="text-right">
                          <div className="text-xs font-interface font-bold">{log.actor?.first_name} {log.actor?.last_name}</div>
                          <div className="text-[9px] font-data text-text-dim uppercase">Credential_Verified</div>
                       </div>
                       <div className="p-2 bg-white/5 rounded-full text-text-dim">
                          <User size={14} />
                       </div>
                    </div>
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
