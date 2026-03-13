import { createClient } from '@/lib/supabase/server'

export async function getEvaluatorAssignments() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('evaluations')
    .select(`
      *,
      project:projects(title, innovation_category, trl_level)
    `)
    .eq('evaluator_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching assignments:', error)
    return []
  }

  return data
}

export async function getEvaluationDetails(evaluationId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('evaluations')
    .select(`
      *,
      project:projects(*, pi:profiles(*))
    `)
    .eq('id', evaluationId)
    .single()

  if (error) {
    console.error('Error fetching evaluation details:', error)
    return null
  }

  return data
}

export async function submitEvaluationEntry(evaluationId: string, scores: { criteria_name: string, score: number, comments?: string }[], overallFeedback: string) {
  const supabase = createClient()
  
  // 1. Insert detailed scoring results
  const { error: scoreError } = await supabase
    .from('scoring_results')
    .insert(scores.map(s => ({
      evaluation_id: evaluationId,
      ...s
    })))

  if (scoreError) throw scoreError

  // 2. Calculate overall score (simple average for now)
  const avgScore = (scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length) * 10 // scale to 100

  // 3. Update evaluation status and feedback
  const { error: evalError } = await supabase
    .from('evaluations')
    .update({
      status: 'COMPLETED',
      overall_score: avgScore,
      feedback: overallFeedback,
      updated_at: new Date().toISOString()
    })
    .eq('id', evaluationId)

  if (evalError) throw evalError

  return { success: true }
}
