import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BrainCircuit, LogOut, User, LayoutGrid, ShieldAlert, ClipboardCheck } from 'lucide-react'
import { NotificationPanel } from '@/components/shared/NotificationPanel'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch roles for the switcher
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)

  const isHubAdmin = roles?.some(r => r.role === 'HUB_ADMIN')
  const isEvaluator = roles?.some(r => r.role === 'EVALUATOR')

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-signal-intel/30 selection:text-white">
      {/* Top Intelligence Bar */}
      <header className="h-16 border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-signal-intel/10 rounded group-hover:bg-signal-intel/20 transition-colors">
              <BrainCircuit className="text-signal-intel" size={20} />
            </div>
            <span className="font-interface font-black tracking-tighter text-lg uppercase">
              ILIS <span className="text-signal-intel">Node_01</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1 border-l border-white/10 pl-6 space-x-2">
            <Link 
              href="/innovator" 
              className="text-[10px] font-data font-bold tracking-[0.2em] text-text-muted hover:text-signal-intel transition-colors uppercase px-3 py-2"
            >
              Innovator_Hub
            </Link>
            <Link 
              href="/innovator/projects" 
              className="text-[10px] font-data font-bold tracking-[0.2em] text-text-muted hover:text-signal-intel transition-colors uppercase px-3 py-2"
            >
              IP_Repository
            </Link>
            {isEvaluator && (
              <Link 
                href="/evaluator" 
                className="text-[10px] font-data font-bold tracking-[0.2em] text-text-muted hover:text-signal-healthy transition-colors uppercase px-3 py-2"
              >
                Evaluations
              </Link>
            )}
            {isHubAdmin && (
              <>
                <Link 
                  href="/admin" 
                  className="text-[10px] font-data font-bold tracking-[0.2em] text-text-muted hover:text-signal-intel transition-colors uppercase px-3 py-2"
                >
                  Governance
                </Link>
                <Link 
                  href="/admin/audit" 
                  className="text-[10px] font-data font-bold tracking-[0.2em] text-text-muted hover:text-signal-intel transition-colors uppercase px-3 py-2"
                >
                  Audit_Logs
                </Link>
                <Link 
                  href="/admin/users" 
                  className="text-[10px] font-data font-bold tracking-[0.2em] text-text-muted hover:text-signal-intel transition-colors uppercase px-3 py-2"
                >
                  Identity_Registry
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-[10px] font-data text-signal-healthy uppercase tracking-tighter flex items-center gap-1">
               <div className="w-1 h-1 rounded-full bg-signal-healthy animate-pulse" />
               System_Online
            </span>
            <span className="text-[9px] font-data text-text-dim uppercase">{user.email}</span>
          </div>
          
          <div className="flex items-center gap-1 bg-background/50 border border-white/5 rounded-xl p-1">
            {/* Quick Access Role Switcers */}
            {isHubAdmin && (
              <Link href="/admin" className="p-2 hover:bg-signal-intel/10 rounded-lg transition-colors text-text-dim hover:text-signal-intel" title="Admin Command Center">
                <ShieldAlert size={18} />
              </Link>
            )}
            {isEvaluator && (
              <Link href="/evaluator" className="p-2 hover:bg-signal-healthy/10 rounded-lg transition-colors text-text-dim hover:text-signal-healthy" title="Evaluator Terminal">
                <ClipboardCheck size={18} />
              </Link>
            )}

            <div className="w-[1px] h-4 bg-white/10 mx-1" />

            <NotificationPanel />

            <Link href="/profile" className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-muted hover:text-text-primary">
              <User size={18} />
            </Link>
            
            <form action="/auth/signout" method="post">
              <button className="p-2 hover:bg-signal-stagnant/10 rounded-lg transition-colors text-text-muted hover:text-signal-stagnant">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="p-6 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
        {children}
      </main>
    </div>
  )
}
