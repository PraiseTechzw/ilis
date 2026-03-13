import { createClient } from '@/lib/supabase/server'

export type UserRole = 'INNOVATOR' | 'EVALUATOR' | 'HUB_ADMIN' | 'EXECUTIVE'

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return data.role as UserRole
}

export async function getRedirectPath(role: UserRole | null): Promise<string> {
  switch (role) {
    case 'HUB_ADMIN':
    case 'EXECUTIVE':
      return '/admin'
    case 'EVALUATOR':
      return '/evaluator'
    case 'INNOVATOR':
    default:
      return '/innovator'
  }
}
