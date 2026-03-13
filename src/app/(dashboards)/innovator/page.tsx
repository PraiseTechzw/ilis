import { IntakeForm } from '@/components/forms/IntakeForm'
import { Plus, Rocket, BookOpen, Layers } from 'lucide-react'

export default function InnovatorPage() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-interface font-black tracking-tight uppercase">
          Innovator <span className="text-signal-intel underline decoration-2 underline-offset-8 decoration-signal-intel/50">Command_Center</span>
        </h1>
        <p className="text-text-muted font-interface text-sm max-w-2xl">
          Welcome to the ILIS core operational terminal. From here you can initialize new intellectual property, track your existing project status, and view algorithmic viability assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form Intake */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3 mb-2 px-1">
            <Plus size={16} className="text-signal-intel" />
            <span className="text-xs font-data font-bold tracking-[0.3em] uppercase text-text-muted">
              Initialize_New_Project
            </span>
          </div>
          <IntakeForm />
        </div>

        {/* Right Column: Quick Stats & Activity */}
        <div className="lg:col-span-5 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-1">
              <Layers size={16} className="text-signal-intel" />
              <span className="text-xs font-data font-bold tracking-[0.3em] uppercase text-text-muted">
                Portfolio_Summary
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface border border-white/5 p-4 rounded-lg group hover:border-signal-healthy/50 transition-colors">
                <Rocket size={20} className="text-signal-healthy mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-data font-bold">01</div>
                <div className="text-[10px] font-data text-text-muted tracking-wide uppercase">Active_Projects</div>
              </div>
              <div className="bg-surface border border-white/5 p-4 rounded-lg group hover:border-signal-intel/50 transition-colors">
                <BookOpen size={20} className="text-signal-intel mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-data font-bold">12</div>
                <div className="text-[10px] font-data text-text-muted tracking-wide uppercase">Total_Evaluations</div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 px-1">
              <Plus size={16} className="text-signal-intel" />
              <span className="text-xs font-data font-bold tracking-[0.3em] uppercase text-text-muted">
                System_Bulletins
              </span>
            </div>
            
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 bg-surface/30 border-l border-signal-intel/30 rounded-r-md">
                  <div className="text-[10px] font-data text-signal-intel uppercase mb-1">Alert // Registry_Update</div>
                  <p className="text-xs font-interface text-text-primary leading-relaxed opacity-80">
                    Your recent submission "Neural Architecture" has entered the <span className="text-signal-healthy underline decoration-dotted">Triage_Phase</span>. An evaluator will be assigned within 48h.
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
