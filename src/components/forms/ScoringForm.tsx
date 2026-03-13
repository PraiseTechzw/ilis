'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { submitEvaluationEntry } from '@/services/evaluation'
import { CheckCircle, AlertCircle, Zap, TrendingUp, Cpu, Users, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

const RUBRIC = [
  { id: 'innovation', name: 'Innovation_Novelty', icon: <Zap size={16} />, weight: 0.25 },
  { id: 'market', name: 'Market_Potential', icon: <TrendingUp size={16} />, weight: 0.25 },
  { id: 'tech', name: 'Technical_Feasibility', icon: <Cpu size={16} />, weight: 0.20 },
  { id: 'team', name: 'Strategic_Alignment', icon: <Users size={16} />, weight: 0.15 },
  { id: 'impact', name: 'Socio-Economic_Impact', icon: <Globe size={16} />, weight: 0.15 },
]

interface ScoringFormProps {
  evaluationId: string
  projectName: string
}

export function ScoringForm({ evaluationId, projectName }: ScoringFormProps) {
  const [scores, setScores] = useState<Record<string, number>>(
    RUBRIC.reduce((acc, r) => ({ ...acc, [r.id]: 0 }), {})
  )
  const [comments, setComments] = useState<Record<string, string>>(
    RUBRIC.reduce((acc, r) => ({ ...acc, [r.id]: '' }), {})
  )
  const [overallFeedback, setOverallFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleScoreChange = (id: string, value: number) => {
    setScores(prev => ({ ...prev, [id]: value }))
  }

  const handleCommentChange = (id: string, value: string) => {
    setComments(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all scores are set
    if (Object.values(scores).some(s => s === 0)) {
      setError("Incomplete data. All criteria must be scored.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const scoringArray = RUBRIC.map(r => ({
        criteria_name: r.name,
        score: scores[r.id],
        weight: r.weight,
        comments: comments[r.id]
      }))

      await submitEvaluationEntry(evaluationId, scoringArray, overallFeedback)
      router.push('/evaluator')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to inject evaluation data.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="space-y-6">
        {RUBRIC.map((item) => (
          <div key={item.id} className="bg-surface/50 border border-white/5 p-6 rounded-2xl space-y-4 group hover:border-signal-healthy/20 transition-all">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/5 rounded-lg text-signal-healthy">
                      {item.icon}
                   </div>
                   <h4 className="font-interface font-bold uppercase tracking-widest text-sm">{item.name}</h4>
                </div>
                <div className="flex items-center gap-1.5 overflow-hidden rounded-lg border border-white/10 p-1 bg-background">
                   {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                     <button
                        key={num}
                        type="button"
                        onClick={() => handleScoreChange(item.id, num)}
                        className={cn(
                          "w-8 h-8 rounded font-data text-xs transition-all",
                          scores[item.id] === num 
                            ? "bg-signal-healthy text-background font-black" 
                            : "hover:bg-white/5 text-text-dim hover:text-text-primary"
                        )}
                     >
                        {num}
                     </button>
                   ))}
                </div>
             </div>
             
             <Textarea 
                placeholder={`Technical notes for ${item.name.replace('_', ' ')}...`}
                value={comments[item.id]}
                onChange={(e) => handleCommentChange(item.id, e.target.value)}
                className="bg-background/50 border-white/5 text-[11px] h-20"
             />
          </div>
        ))}
      </div>

      <div className="space-y-4">
         <h4 className="font-data font-bold uppercase tracking-widest text-xs text-text-muted flex items-center gap-2">
            <AlertCircle size={14} className="text-signal-healthy" />
            Executive_Summary_Feedback
         </h4>
         <Textarea 
            required
            placeholder="Provide a high-level justification for the overall scoring. This will be visible to Hub Admins and the Lead Innovator."
            value={overallFeedback}
            onChange={(e) => setOverallFeedback(e.target.value)}
            className="min-h-[150px] bg-surface border-white/5 font-interface leading-relaxed italic"
         />
      </div>

      {error && (
        <div className="p-4 bg-signal-stagnant/10 border border-signal-stagnant/20 rounded-xl text-signal-stagnant text-xs font-data flex items-center gap-3">
           <AlertCircle size={16} />
           {error}
        </div>
      )}

      <div className="pt-4 flex items-center gap-6">
         <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 bg-signal-healthy hover:bg-signal-healthy/90 text-background font-black uppercase tracking-widest h-14"
         >
            {isSubmitting ? 'ENCRYPTING_DATA...' : 'TRANSMIT_FINAL_EVALUATION'}
         </Button>
         <Link href="/evaluator" className="text-xs font-data text-text-muted hover:text-text-primary uppercase tracking-widest underline underline-offset-4">
           Abort_Entry
         </Link>
      </div>
    </form>
  )
}
