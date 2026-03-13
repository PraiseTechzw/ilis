import { createClient } from '@/lib/supabase/server'

export async function getAdminPipelineStats() {
  const supabase = createClient()
  
  const { data, error } = await supabase.rpc('get_admin_pipeline_stats')

  if (error) {
    console.error('Error fetching admin stats:', error)
    return null
  }

  return data[0]
}

export async function getProjectStageMetrics() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('mv_project_stage_metrics')
    .select('*')

  if (error) {
    console.error('Error fetching stage metrics:', error)
    return []
  }

  return data
}

export async function getTriageQueue() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      pi:profiles(first_name, last_name, email)
    `)
    .eq('current_stage', 'INTAKE')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching triage queue:', error)
    return []
  }

  return data
}


export async function getAvailableEvaluators() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      user_id,
      profiles:profiles(first_name, last_name, email)
    `)
    .eq('role', 'EVALUATOR')

  if (error) {
    console.error('Error fetching evaluators:', error)
    return []
  }

  return data.map((r: any) => ({
    id: r.user_id,
    name: `${r.profiles?.first_name} ${r.profiles?.last_name}`,
    email: r.profiles?.email
  }))
}

export async function getGlobalAuditLogs() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('stage_history')
    .select(`
      *,
      project:projects(title),
      actor:profiles!changed_by(first_name, last_name)
    `)
    .order('changed_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching global audit logs:', error)
    return []
  }

  return data
}

export async function getInstitutionalUsers() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      first_name,
      last_name,
      email,
      user_roles(role)
    `)
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching institutional users:', error)
    return []
  }

  return data
}
