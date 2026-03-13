import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Future logic: Fetch role from database and redirect accordingly
  // For now, default to /innovator
  redirect('/innovator')
}
