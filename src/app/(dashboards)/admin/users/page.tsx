import { getInstitutionalUsers } from "@/services/admin"
import { Users, ArrowLeft, Shield, Mail } from "lucide-react"
import Link from "next/link"

export default async function InstitutionalUsersPage() {
  const users = await getInstitutionalUsers()

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
          Institutional <span className="text-signal-intel">Identity</span> _Registry
        </h1>
      </div>

      <div className="bg-surface/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="p-6 text-[10px] font-data text-text-dim uppercase tracking-widest">User_Entity</th>
              <th className="p-6 text-[10px] font-data text-text-dim uppercase tracking-widest">Email_Credential</th>
              <th className="p-6 text-[10px] font-data text-text-dim uppercase tracking-widest">Assigned_Clearances</th>
              <th className="p-6 text-[10px] font-data text-text-dim uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center font-data text-xs text-text-dim uppercase italic">
                  Registry_Empty // No_User_Data_Detected
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-signal-intel/10 border border-signal-intel/20 flex items-center justify-center text-signal-intel font-data font-bold">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                       </div>
                       <div>
                          <div className="text-sm font-interface font-bold text-text-primary group-hover:text-signal-intel transition-colors lowercase">
                             {user.first_name}_{user.last_name}
                          </div>
                          <div className="text-[9px] font-data text-text-dim uppercase">Status: Active_Session</div>
                       </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-xs font-interface text-text-muted">
                       <Mail size={12} />
                       {user.email}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-wrap gap-2">
                       {user.user_roles.map((r: any, idx: number) => (
                         <span key={idx} className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] font-data text-text-primary uppercase tracking-tighter">
                            {r.role}
                         </span>
                       ))}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-[9px] font-data text-text-dim hover:text-signal-intel uppercase tracking-widest transition-colors font-bold border border-white/5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10">
                       Update_Clearance
                    </button>
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
