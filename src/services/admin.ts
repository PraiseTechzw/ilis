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

export async function assignProjectToEvaluator(projectId: string, evaluatorId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('evaluations')
    .insert({
      project_id: projectId,
      evaluator_id: evaluatorId,
      status: 'PENDING'
    })
    .select()
    .single()

  if (error) {
    console.error('Error assigning evaluator:', error)
    throw error
  }

  // Update project stage to EVALUATION
  await supabase
    .from('projects')
    .update({ current_stage: 'EVALUATION' })
    .eq('id', projectId)

  return data
}
