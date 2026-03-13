import { getEvaluationDetails } from "@/services/evaluation"
import { getProjectDocuments } from "@/services/projects"
import { ScoringForm } from "@/components/forms/ScoringForm"
import { ArrowLeft, FileText, Download, Shield, Layout, Settings, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function EvaluationPage({ params }: { params: { id: string } }) {
  const evalItem = await getEvaluationDetails(params.id)
  if (!evalItem) notFound()
  
  const documents = await getProjectDocuments(evalItem.project_id)

  return (
    <div className="space-y-10 pb-20">
      {/* Back Link */}
      <Link 
        href="/evaluator" 
        className="flex items-center gap-2 text-[10px] font-data font-bold text-text-muted hover:text-signal-healthy transition-colors uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={14} />
        Back_to_Assignment_Queue
      </Link>

      <div className="flex flex-col xl:flex-row gap-12 items-start">
        {/* Project Context Column */}
        <div className="w-full xl:w-[450px] space-y-10">
           <section className="space-y-6 sticky top-24">
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-data text-signal-healthy font-bold tracking-widest uppercase bg-signal-healthy/5 px-2 py-0.5 rounded border border-signal-healthy/20">
                      {evalItem.project.innovation_category}
                    </span>
                    <span className="text-[10px] font-data text-text-dim tracking-widest uppercase">
                      Node_Context
                    </span>
                 </div>
                 <h1 className="text-4xl font-interface font-black uppercase tracking-tighter leading-tight">
                    {evalItem.project.title}
                 </h1>
              </div>

              <div className="bg-surface/30 border border-white/5 p-6 rounded-2xl space-y-4">
                 <h3 className="text-[10px] font-data font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                    <Shield size={14} className="text-signal-healthy" />
                    Innovator_Intelligence
                 </h3>
                 <div className="space-y-1">
                    <div className="text-sm font-bold">{evalItem.project.pi.first_name} {evalItem.project.pi.last_name}</div>
                    <div className="text-[10px] font-data text-text-dim uppercase tracking-widest">Lead_PI</div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-data font-bold uppercase tracking-widest text-text-muted">Technical_Abstract</h4>
                 <p className="text-xs font-interface leading-relaxed opacity-70 italic border-l-2 border-white/10 pl-4">
                    "{evalItem.project.abstract}"
                 </p>
              </div>

              {/* Research Artifacts */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-data font-bold uppercase tracking-widest text-text-muted">Research_Artifacts ({documents.length})</h4>
                 <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="bg-surface/50 border border-white/5 p-3 rounded-lg flex items-center justify-between group hover:border-signal-healthy/30 transition-all">
                         <div className="flex items-center gap-3">
                            <FileText size={16} className="text-text-dim group-hover:text-signal-healthy transition-colors" />
                            <div className="text-[10px] font-bold truncate max-w-[180px] uppercase font-data">{doc.file_name}</div>
                         </div>
                         <button className="text-text-dim hover:text-signal-healthy transition-colors">
                            <Download size={14} />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>
           </section>
        </div>

        {/* Scoring Engine Column */}
        <div className="flex-1 space-y-10">
           <div className="bg-surface/10 border border-signal-healthy/20 p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Settings size={200} className="animate-spin-slow" />
              </div>
              
              <div className="relative z-10 space-y-8">
                 <div className="flex border-b border-white/5 pb-6">
                    <div className="space-y-1">
                       <h2 className="text-2xl font-interface font-black uppercase tracking-tight">
                          Rubric_Injection_v1.0
                       </h2>
                       <p className="text-[10px] font-data text-text-dim uppercase tracking-[0.2em]">
                          Scoring protocol active // Quantitative weightage applied
                       </p>
                    </div>
                 </div>

                 <ScoringForm evaluationId={evalItem.id} projectName={evalItem.project.title} />
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
