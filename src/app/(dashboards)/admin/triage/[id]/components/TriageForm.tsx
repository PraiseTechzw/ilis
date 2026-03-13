'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { assignProjectToEvaluatorAction } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react'

interface TriageFormProps {
  projectId: string
  evaluators: { id: string, name: string, email: string }[]
}

export function TriageForm({ projectId, evaluators }: TriageFormProps) {
  const [evaluatorId, setEvaluatorId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const router = useRouter()

  const handleTriage = async () => {
    if (!evaluatorId) return

    setIsSubmitting(true)
    setFeedback(null)

    try {
      await assignProjectToEvaluatorAction(projectId, evaluatorId)
      setFeedback({ type: 'success', message: 'Node_Transition_Success: Dispatched to Evaluator.' })
      setTimeout(() => {
        router.push('/admin/triage')
        router.refresh()
      }, 1500)
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message || 'Node_Transition_System_Error.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[10px] font-data text-text-dim uppercase tracking-widest block">
          Select_Expert_Assessor
        </label>
        <select 
          value={evaluatorId}
          onChange={(e) => setEvaluatorId(e.target.value)}
          className="w-full bg-background border border-white/10 rounded-lg p-3 text-sm text-text-primary focus:ring-1 focus:ring-signal-intel outline-none transition-all appearance-none"
        >
          <option value="">SELECT_EVALUATOR_NODE</option>
          {evaluators.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.name} ({ev.email})</option>
          ))}
        </select>
      </div>

      <div className="bg-background/50 border border-white/5 p-4 rounded-lg space-y-2">
        <div className="text-[9px] font-data text-text-muted uppercase">Deployment_Notes</div>
        <p className="text-[10px] font-interface text-text-dim leading-relaxed">
          Executing this transition will advance the project node from <span className="text-signal-intel">INTAKE</span> to <span className="text-signal-intel">EVALUATION</span> and notify the selected expert.
        </p>
      </div>

      {feedback && (
        <div className={`p-4 rounded border text-[10px] font-data flex items-center gap-3 ${
          feedback.type === 'success' 
            ? 'bg-signal-healthy/10 border-signal-healthy/20 text-signal-healthy' 
            : 'bg-signal-stagnant/10 border-signal-stagnant/20 text-signal-stagnant'
        }`}>
          {feedback.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          <span className="uppercase tracking-widest">{feedback.message}</span>
        </div>
      )}

      <Button
        disabled={!evaluatorId || isSubmitting}
        onClick={handleTriage}
        className="w-full bg-signal-intel font-bold text-background hover:bg-signal-intel/90 h-12 gap-2 uppercase tracking-[0.2em] text-[10px]"
      >
        <UserPlus size={16} />
        {isSubmitting ? 'DISPATCHING...' : 'EXECUTE_EVALUATION_PHASE'}
      </Button>
    </div>
  )
}
