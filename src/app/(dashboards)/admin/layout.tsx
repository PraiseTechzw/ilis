import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)

  const hasAccess = roles?.some(r => r.role === 'HUB_ADMIN' || r.role === 'EXECUTIVE')

  if (!hasAccess) {
    redirect('/')
  }

  return <>{children}</>
}
