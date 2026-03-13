import { getProjectDetails, getProjectDocuments, getProjectStageHistory } from "@/services/projects"
import { ProgressionTrack } from "@/components/shared/ProgressionTrack"
import { VaultUploader } from "@/components/shared/VaultUploader"
import { ArrowLeft, FileText, Download, Shield, Layout, Settings, Activity } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProjectDetails(params.id)
  const documents = await getProjectDocuments(params.id)
  const history = await getProjectStageHistory(params.id)

  if (!project) notFound()

  return (
    <div className="space-y-10 pb-20">
      {/* Breadcrumbs / Back */}
      <Link 
        href="/innovator/projects" 
        className="flex items-center gap-2 text-[10px] font-data font-bold text-text-muted hover:text-signal-intel transition-colors uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={14} />
        Back_to_Repository
      </Link>

      <div className="flex flex-col xl:flex-row gap-10 items-start">
        {/* Main Intel Column */}
        <div className="flex-1 space-y-10">
          <section className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-data text-signal-intel font-bold tracking-widest uppercase bg-signal-intel/5 px-2 py-0.5 rounded border border-signal-intel/20">
                  {project.innovation_category}
                </span>
                <span className="text-[10px] font-data text-text-muted tracking-widest uppercase">
                  Project_ID: {project.id.split('-')[0]}
                </span>
              </div>
              <h1 className="text-5xl font-interface font-black uppercase tracking-tighter leading-none">
                {project.title}
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-surface/30 border border-white/5 p-8 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Layout size={120} />
               </div>
               
               <ProgressionTrack 
                  label="Technical_Readiness_Level (TRL)" 
                  currentLevel={project.trl_level} 
                  color="bg-signal-intel"
               />
               <ProgressionTrack 
                  label="Investment_Readiness_Level (IRL)" 
                  currentLevel={project.irl_level} 
                  color="bg-signal-healthy"
               />
            </div>

            <div className="space-y-4">
               <h3 className="text-xs font-data font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                  <Shield size={14} className="text-signal-intel" />
                  Technical_Abstract
               </h3>
               <p className="text-text-primary/80 font-interface leading-relaxed max-w-4xl text-lg italic bg-white/5 p-6 rounded-xl border border-white/5">
                  "{project.abstract}"
               </p>
            </div>
          </section>

          {/* Document Vault Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
               <h3 className="text-xs font-data font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                  <FileText size={14} className="text-signal-intel" />
                  Secure_Artifact_Vault
               </h3>
               <span className="text-[10px] font-data text-text-dim uppercase">{documents.length}_Items_Stored</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {documents.length === 0 ? (
                 <div className="md:col-span-2 py-10 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl text-text-dim">
                    <span className="text-[10px] font-data uppercase">No_Artifacts_Detected</span>
                 </div>
               ) : (
                 documents.map((doc) => (
                   <div key={doc.id} className="bg-surface/50 border border-white/5 p-4 rounded-lg flex items-center justify-between group hover:border-signal-intel/30 transition-all">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white/5 rounded text-text-muted group-hover:text-signal-intel transition-colors">
                            <FileText size={20} />
                         </div>
                         <div>
                            <div className="text-sm font-bold truncate max-w-[200px]">{doc.file_name}</div>
                            <div className="text-[9px] font-data text-text-dim uppercase">{doc.document_type}</div>
                         </div>
                      </div>
                      <button className="p-2 hover:bg-signal-intel/10 rounded-lg text-text-dim hover:text-signal-intel transition-all">
                         <Download size={18} />
                      </button>
                   </div>
                 ))
               )}
            </div>
          </section>

          {/* Activity Logs / History */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
               <h3 className="text-xs font-data font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                  <Activity size={14} className="text-signal-intel" />
                  Lifecycle_Audit_Trail
               </h3>
            </div>

            <div className="space-y-4">
               {history.length === 0 ? (
                 <p className="text-[10px] font-data text-text-dim uppercase">No_Historical_Data_Injection</p>
               ) : (
                 history.map((entry: any) => (
                   <div key={entry.id} className="flex gap-4 items-start group">
                      <div className="mt-1 flex flex-col items-center">
                         <div className="w-2 h-2 rounded-full bg-signal-intel group-hover:scale-125 transition-transform" />
                         <div className="w-[1px] h-12 bg-white/5" />
                      </div>
                      <div className="space-y-1">
                         <div className="text-[10px] font-data text-signal-intel uppercase tracking-widest">
                            {new Date(entry.changed_at).toLocaleString()}
                         </div>
                         <div className="text-sm font-interface font-bold text-text-primary">
                            Stage: {entry.old_stage} → {entry.new_stage}
                         </div>
                         <p className="text-[10px] font-interface text-text-muted italic">
                            {entry.reason || 'System automated stage transition.'}
                         </p>
                      </div>
                   </div>
                 ))
               )}
            </div>
          </section>
        </div>

        {/* Action Sidebar */}
        <div className="w-full xl:w-[400px] space-y-10">
           <VaultUploader projectId={project.id} />
           
           <div className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-text-dim" />
                <h3 className="font-interface font-bold uppercase tracking-widest text-sm text-text-muted">Node_Operations</h3>
              </div>
              <div className="space-y-2">
                 <Button className="w-full justify-start bg-white/5 hover:bg-white/10 text-text-primary border border-white/5 h-10 text-[10px] font-data uppercase tracking-widest">
                    Request_Evaluation
                 </Button>
                 <Button className="w-full justify-start bg-white/5 hover:bg-white/10 text-text-primary border border-white/5 h-10 text-[10px] font-data uppercase tracking-widest">
                    Update_Metadata
                 </Button>
                 <Button className="w-full justify-start bg-white/5 hover:bg-signal-stagnant/10 text-signal-stagnant border border-signal-stagnant/10 h-10 text-[10px] font-data uppercase tracking-widest">
                    Archive_Node
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
