import { createClient } from '@/lib/supabase/server'

export async function getUserProjects() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('projects')
    .select()
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data
}

export async function getProjectDetails(projectId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select()
    .eq('id', projectId)
    .single()

  if (error) {
    console.error('Error fetching project details:', error)
    return null
  }

  return data
}

export async function getProjectDocuments(projectId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('documents')
    .select()
    .eq('project_id', projectId)

  if (error) {
    console.error('Error fetching project documents:', error)
    return []
  }

  return data
}

export async function getProjectStageHistory(projectId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('stage_history')
    .select()
    .eq('project_id', projectId)
    .order('changed_at', { ascending: false })

  if (error) {
    console.error('Error fetching stage history:', error)
    return []
  }

  return data
}
