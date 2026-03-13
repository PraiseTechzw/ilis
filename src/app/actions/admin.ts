'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function assignProjectToEvaluatorAction(projectId: string, evaluatorId: string) {
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
    throw new Error(error.message)
  }

  // Update project stage to EVALUATION
  const { error: updateError } = await supabase
    .from('projects')
    .update({ current_stage: 'EVALUATION' })
    .eq('id', projectId)

  if (updateError) {
    console.error('Error updating project stage:', updateError)
    throw new Error(updateError.message)
  }

  revalidatePath('/admin/triage')
  revalidatePath(`/admin/triage/${projectId}`)
  
  return data
}
