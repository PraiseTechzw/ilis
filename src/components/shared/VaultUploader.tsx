'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Upload, File, X, CheckCircle, AlertCircle, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface VaultUploaderProps {
  projectId: string
}

export function VaultUploader({ projectId }: VaultUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStatus(null)
    }
  }

  const uploadFile = async () => {
    if (!file) return

    setIsUploading(true)
    setStatus(null)
    setProgress(10)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${projectId}/${fileName}`

      // 1. Upload to Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('project_documents')
        .upload(filePath, file)

      if (storageError) throw storageError
      setProgress(60)

      // 2. Track in DB
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Auth state lost')

      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          project_id: projectId,
          uploaded_by: user.id,
          bucket_path: filePath,
          file_name: file.name,
          document_type: 'GENERIC_VAULT_ITEM'
        })

      if (dbError) throw dbError
      
      setProgress(100)
      setStatus({ type: 'success', message: 'Document secured in vault.' })
      setFile(null)
      router.refresh()
    } catch (error: any) {
      console.error('Upload failed:', error)
      setStatus({ type: 'error', message: error.message || 'Injection failed.' })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-surface/50 border border-white/5 rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield size={18} className="text-signal-intel" />
        <h3 className="font-interface font-bold uppercase tracking-widest text-sm">Secure_Vault_Injection</h3>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-white/5 rounded-xl hover:bg-white/5 hover:border-signal-intel/30 transition-all cursor-pointer group">
          <Upload size={32} className="text-text-dim group-hover:text-signal-intel transition-colors mb-4" />
          <span className="text-xs font-data text-text-muted group-hover:text-text-primary transition-colors uppercase">Select_Payload (PDF, DOCX, XLSX)</span>
          <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.xlsx" />
        </label>
      ) : (
        <div className="bg-background/80 border border-white/5 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-signal-intel/10 rounded text-signal-intel">
              <File size={24} />
            </div>
            <div>
              <div className="text-sm font-interface font-bold text-text-primary truncate max-w-[200px]">{file.name}</div>
              <div className="text-[10px] font-data text-text-muted uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          </div>
          <button 
            onClick={() => setFile(null)}
            className="p-2 hover:bg-white/5 rounded-full text-text-dim hover:text-signal-stagnant transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-data text-text-muted uppercase">
            <span>Encrypting_Transfer...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-signal-intel transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status && (
        <div className={cn(
          "p-3 rounded border text-xs font-data flex items-center gap-3",
          status.type === 'success' ? "bg-signal-healthy/10 border-signal-healthy/20 text-signal-healthy" : "bg-signal-stagnant/10 border-signal-stagnant/20 text-signal-stagnant"
        )}>
          {status.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {status.message}
        </div>
      )}

      <Button
        disabled={!file || isUploading}
        onClick={uploadFile}
        className="w-full bg-signal-intel font-bold text-background hover:bg-signal-intel/90 h-12"
      >
        {isUploading ? 'ENCRYPTING...' : 'EXECUTE_VAULT_DEPOSIT'}
      </Button>
    </div>
  )
}
