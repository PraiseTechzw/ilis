import { getProjectDetails, getProjectDocuments } from "@/services/projects"
import { getAvailableEvaluators } from "@/services/admin"
import { notFound } from "next/navigation"
import { ArrowLeft, Shield, FileText, UserPlus, Info } from "lucide-react"
import Link from "next/link"
import { TriageForm } from "./components/TriageForm"

export default async function TriageDetailPage({ params }: { params: { id: string } }) {
  const project = await getProjectDetails(params.id)
  if (!project) notFound()

  const documents = await getProjectDocuments(params.id)
  const evaluators = await getAvailableEvaluators()

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <Link 
          href="/admin/triage" 
          className="flex items-center gap-2 text-[10px] font-data font-bold text-text-muted hover:text-signal-intel transition-colors uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={14} />
          Back_to_Triage_Queue
        </Link>
        <h1 className="text-4xl font-interface font-black uppercase tracking-tight">
          Node_Analysis: <span className="text-signal-intel">{project.title}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 space-y-10">
          {/* Technical Abstract */}
          <section className="bg-surface border border-white/5 p-8 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Info size={18} className="text-signal-intel" />
              <h3 className="text-sm font-interface font-bold uppercase tracking-widest">Submission_Intelligence</h3>
            </div>
            <div className="grid grid-cols-2 gap-8 py-4">
              <div>
                <span className="text-[10px] font-data text-text-dim uppercase block">Innovation_Category</span>
                <span className="text-sm font-interface font-bold text-text-primary">{project.innovation_category}</span>
              </div>
              <div>
                <span className="text-[10px] font-data text-text-dim uppercase block">TRL_Claimed</span>
                <span className="text-sm font-interface font-bold text-signal-intel">LVL_0{project.trl_level}</span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-data text-text-dim uppercase block">Technical_Abstract</span>
              <p className="text-sm text-text-primary/80 leading-relaxed italic">"{project.abstract}"</p>
            </div>
          </section>

          {/* Documents Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-signal-intel" />
              <h3 className="text-sm font-interface font-bold uppercase tracking-widest text-text-muted text-sm">Artifact_Verification</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {documents.length === 0 ? (
                 <div className="md:col-span-2 py-10 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl text-text-dim">
                    <span className="text-[10px] font-data uppercase font-bold">No_Artifacts_Submitted_Yet</span>
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
                      <Link href={doc.bucket_path} target="_blank" className="p-2 hover:bg-signal-intel/10 rounded-lg text-text-dim hover:text-signal-intel transition-all">
                         <FileText size={18} />
                      </Link>
                   </div>
                 ))
               )}
            </div>
          </section>
        </div>

        {/* Triage Actions Sidebar */}
        <div className="xl:col-span-4">
          <section className="bg-surface border border-white/5 p-6 rounded-2xl space-y-6 sticky top-24">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-signal-intel" />
              <h3 className="text-sm font-interface font-bold uppercase tracking-widest">Protocol_Alignment</h3>
            </div>
            
            <TriageForm projectId={project.id} evaluators={evaluators} />
          </section>
        </div>
      </div>
    </div>
  )
}
