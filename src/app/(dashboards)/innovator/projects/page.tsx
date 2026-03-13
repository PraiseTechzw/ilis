import { getUserProjects } from "@/services/projects"
import { ProjectCard } from "@/components/shared/ProjectCard"
import { Database, Search, Filter, Plus } from "lucide-react"
import Link from "next/link"

export default async function ProjectsPage() {
  const projects = await getUserProjects()

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-signal-intel/10 rounded border border-signal-intel/20 text-signal-intel">
              <Database size={20} />
            </div>
            <h1 className="text-4xl font-interface font-black tracking-tight uppercase">
              IP <span className="text-signal-intel">Repository</span>
            </h1>
          </div>
          <p className="text-text-muted font-interface text-sm max-w-2xl">
            Centralized hub for all your submitted intellectual property and research artifacts.
          </p>
        </div>

        <Link 
          href="/innovator" 
          className="flex items-center gap-2 bg-signal-intel font-bold text-background px-6 py-3 rounded-lg hover:bg-signal-intel/90 transition-all active:scale-95 uppercase text-xs tracking-widest"
        >
          <Plus size={16} />
          New_Subway
        </Link>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center gap-4 py-4 border-b border-white/5">
        <div className="flex-1 min-w-[300px] relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-signal-intel transition-colors" />
          <input 
            type="text" 
            placeholder="Search_Repository..."
            className="w-full bg-surface/50 border border-white/5 rounded-lg pl-10 pr-4 h-11 text-sm outline-none focus:ring-1 focus:ring-signal-intel transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 h-11 border border-white/5 bg-surface/50 rounded-lg text-xs font-data uppercase text-text-muted hover:text-text-primary hover:border-white/10 transition-all">
          <Filter size={14} />
          Filters
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-white/5 rounded-3xl bg-surface/30">
          <div className="p-6 bg-white/5 rounded-full text-text-dim">
            <Database size={48} />
          </div>
          <div className="space-y-1">
            <h3 className="font-interface font-bold text-lg uppercase">No_Active_IP_Found</h3>
            <p className="text-sm text-text-muted font-interface">You haven't initialized any projects in the command center yet.</p>
          </div>
          <Link 
            href="/innovator" 
            className="text-signal-intel font-data text-xs uppercase tracking-widest hover:underline pt-4"
          >
            Execute_Intake_Protocol_v0.1
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
