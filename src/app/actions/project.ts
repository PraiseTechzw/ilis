'use server'

import { createClient } from '@/lib/supabase/server'
import { projectIntakeSchema, ProjectIntakeInput } from '@/lib/validations/project'
import { revalidatePath } from 'next/cache'

export async function submitProjectIntake(data: ProjectIntakeInput) {
  const supabase = createClient()
  
  // 1. Validate Input
  const validatedFields = projectIntakeSchema.safeParse(data)
  
  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten())
    return { 
      error: 'Invalid fields submitted.', 
      details: validatedFields.error.flatten().fieldErrors 
    }
  }

  // 2. Get User Session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Authentication required.' }
  }

  // 3. Insert Project
  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      ...validatedFields.data,
      pi_id: user.id
    })
    .select()
    .single()

  if (error) {
    console.error('Project insert error:', error)
    return { error: 'Failed to create project. Please try again.' }
  }

  // 4. Clean cache and success
  revalidatePath('/innovator')
  return { success: true, project }
}
