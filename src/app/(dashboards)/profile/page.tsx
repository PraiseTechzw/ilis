import { createClient } from '@/lib/supabase/server'
import { User, Shield, Fingerprint, Calendar, Mail, MapPin, Activity } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user?.id)

  return (
    <div className="space-y-10">
      <div className="space-y-2">
         <h1 className="text-4xl font-interface font-black uppercase tracking-tight">
            Institutional <span className="text-signal-intel">Identity</span>
         </h1>
         <p className="text-text-muted font-interface text-sm">
            Core profile metadata and security clearances registered within the university innovation grid.
         </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         <div className="xl:col-span-4 space-y-6">
            <div className="bg-surface border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-signal-intel to-transparent" />
               
               <div className="w-24 h-24 rounded-full bg-signal-intel/10 border border-signal-intel/20 flex items-center justify-center relative group">
                  <User size={48} className="text-signal-intel" />
                  <div className="absolute inset-0 rounded-full border border-signal-intel/40 animate-ping opacity-20 scale-125" />
               </div>

               <div>
                  <h2 className="text-2xl font-interface font-black uppercase tracking-tighter">
                     {profile?.first_name} {profile?.last_name}
                  </h2>
                  <p className="text-[10px] font-data text-text-dim uppercase tracking-[0.3em] font-bold mt-1">
                     Node_ID: {user?.id.split('-')[0]}
                  </p>
               </div>

               <div className="flex flex-wrap justify-center gap-2">
                  {roles?.map(r => (
                    <span key={r.role} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-data text-text-primary uppercase tracking-widest">
                       {r.role}
                    </span>
                  ))}
               </div>
            </div>

            <div className="bg-surface/50 border border-white/5 rounded-2xl p-6 space-y-4">
               <div className="flex items-center gap-3">
                  <Fingerprint size={16} className="text-signal-intel" />
                  <span className="text-[10px] font-data font-bold uppercase tracking-widest text-text-muted">Security_Clearance</span>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-data">
                     <span className="text-text-dim uppercase">Auth_Level</span>
                     <span className="text-signal-healthy uppercase">Standard_Access</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-data">
                     <span className="text-text-dim uppercase">Data_Sovereignty</span>
                     <span className="text-text-primary uppercase px-2 py-0.5 bg-white/5 rounded">Local_DC</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="xl:col-span-8 space-y-10">
            <section className="bg-surface/30 border border-white/5 rounded-3xl p-10 space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Shield size={180} />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-2">
                     <label className="text-[10px] font-data text-text-dim uppercase tracking-widest flex items-center gap-2">
                        <Mail size={12} className="text-signal-intel" />
                        Network_Email
                     </label>
                     <div className="text-xl font-interface font-bold border-b border-white/10 pb-2">
                        {user?.email}
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-data text-text-dim uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={12} className="text-signal-intel" />
                        Institutional_Division
                     </label>
                     <div className="text-xl font-interface font-bold border-b border-white/10 pb-2">
                        Faculty_of_Medicine
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-data text-text-dim uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={12} className="text-signal-intel" />
                        Registration_Epoch
                     </label>
                     <div className="text-xl font-interface font-bold border-b border-white/10 pb-2 uppercase">
                        {new Date(profile?.created_at).toLocaleDateString()}
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-data text-text-dim uppercase tracking-widest flex items-center gap-2">
                        <Activity size={12} className="text-signal-intel" />
                        Account_State
                     </label>
                     <div className="text-xl font-interface font-bold border-b border-white/10 pb-2 uppercase text-signal-healthy">
                        Active_Encryption
                     </div>
                  </div>
               </div>

               <div className="pt-10 flex gap-4">
                  <button className="px-8 py-3 bg-signal-intel font-black text-background uppercase text-xs tracking-widest rounded-lg hover:bg-signal-intel/90 transition-all">
                     Update_Profile_Metadata
                  </button>
                  <button className="px-8 py-3 bg-white/5 border border-white/10 font-black text-text-primary uppercase text-xs tracking-widest rounded-lg hover:bg-white/10 transition-all">
                     Revoke_Tokens
                  </button>
               </div>
            </section>
         </div>
      </div>
    </div>
  )
}
