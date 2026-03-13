'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectIntakeSchema, ProjectIntakeInput } from '@/lib/validations/project'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { submitProjectIntake } from '@/app/actions/project'
import { Terminal, Shield, Zap } from 'lucide-react'

export function IntakeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProjectIntakeInput>({
    resolver: zodResolver(projectIntakeSchema),
    defaultValues: {
      trl_level: 1,
      innovation_category: 'SOFTWARE'
    }
  })

  const onSubmit = async (data: ProjectIntakeInput) => {
    setIsSubmitting(true)
    setFeedback(null)
    
    const result = await submitProjectIntake(data)
    
    if (result.error) {
      setFeedback({ type: 'error', message: result.error })
    } else {
      setFeedback({ type: 'success', message: 'Project initialized in grid.' })
      reset()
    }
    setIsSubmitting(false)
  }

  return (
    <div className="w-full max-w-2xl bg-surface border border-white/5 p-6 rounded-lg shadow-2xl relative overflow-hidden group">
      {/* Aesthetic Accents */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Terminal size={120} />
      </div>

      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-signal-intel/10 rounded border border-signal-intel/20 text-signal-intel">
          <Zap size={18} />
        </div>
        <div>
          <h2 className="font-interface font-bold text-xl uppercase tracking-widest text-text-primary">
            Initialize_IP.sh
          </h2>
          <p className="text-xs font-data text-text-muted uppercase">
            ID: PROJECT_INTAKE_PROTOCOL_v0.1
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {feedback && (
          <div className={`p-4 rounded border text-sm font-data flex items-center gap-3 ${
            feedback.type === 'success' 
              ? 'bg-signal-healthy/10 border-signal-healthy/20 text-signal-healthy' 
              : 'bg-signal-stagnant/10 border-signal-stagnant/20 text-signal-stagnant'
          }`}>
            <Shield size={16} />
            {feedback.message}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-data text-text-muted uppercase tracking-tighter">
            01_Project Title
          </label>
          <Input 
            {...register('title')} 
            placeholder="SYSTEM_NAME_OR_RESEARCH_TITLE"
            className="bg-background/50 border-white/5 font-interface h-11"
          />
          {errors.title && <p className="text-[10px] font-data text-signal-stagnant uppercase">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-data text-text-muted uppercase tracking-tighter">
              02_Innovation_Category
            </label>
            <select 
              {...register('innovation_category')}
              className="w-full bg-background/50 border border-white/5 rounded-md h-11 px-3 text-sm text-text-primary focus:ring-1 focus:ring-signal-intel outline-none transition-all"
            >
              <option value="SOFTWARE">SOFTWARE</option>
              <option value="HARDWARE">HARDWARE</option>
              <option value="BIOTECH">BIOTECH</option>
              <option value="CLEANTECH">CLEANTECH</option>
              <option value="SERVICE">SERVICE</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-data text-text-muted uppercase tracking-tighter">
              03_Current_TRL_Scale
            </label>
            <Input 
              type="number" 
              {...register('trl_level')} 
              min={1} 
              max={9}
              className="bg-background/50 border-white/5 font-data h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-data text-text-muted uppercase tracking-tighter">
            04_Technical_Abstract
          </label>
          <Textarea 
            {...register('abstract')} 
            placeholder="COMPREHENSIVE_DESCRIPTION_OF_PROBLEM_AND_SOLUTION"
            className="bg-background/50 border-white/5 min-h-[120px] font-interface text-sm leading-relaxed"
          />
          {errors.abstract && <p className="text-[10px] font-data text-signal-stagnant uppercase">{errors.abstract.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-data text-text-muted uppercase tracking-tighter">
            05_Taxonomy_Tags
          </label>
          <Input 
            {...register('tags')} 
            placeholder="AI, SECURITY, RENEWABLE (COMMA SEPARATED)"
            className="bg-background/50 border-white/5 font-interface h-11"
          />
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="text-[9px] font-data text-text-dim max-w-[200px] leading-tight flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isSubmitting ? 'bg-signal-alert' : 'bg-signal-healthy'}`} />
            IP DATA WILL BE ENCRYPTED VIA AES-256 BEFORE STORAGE INJECTION
          </div>
          <Button 
            disabled={isSubmitting}
            className="bg-signal-intel font-bold text-background hover:bg-signal-intel/90 px-8 transition-transform active:scale-95"
          >
            {isSubmitting ? 'UPLOADING...' : 'EXECUTE_INTAKE'}
          </Button>
        </div>
      </form>
    </div>
  )
}
