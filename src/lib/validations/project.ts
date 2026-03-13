import * as z from 'zod'

export const projectIntakeSchema = z.object({
  title: z.string().min(5, 'Project title must be at least 5 characters'),
  abstract: z.string().min(20, 'Abstract must be at least 20 characters'),
  innovation_category: z.enum(['SOFTWARE', 'HARDWARE', 'BIOTECH', 'CLEANTECH', 'SERVICE']),
  trl_level: z.coerce.number().min(1).max(9).default(1),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(Boolean)),
})

export type ProjectIntakeInput = z.infer<typeof projectIntakeSchema>
