import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { getUserRole, getRedirectPath } = await import('@/services/auth')
  const role = await getUserRole(user.id)
  const path = await getRedirectPath(role)
  
  redirect(path)
}
