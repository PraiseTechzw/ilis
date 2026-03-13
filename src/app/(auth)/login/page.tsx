'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-interface text-3xl font-bold tracking-tighter text-text-primary uppercase">
            ILIS <span className="text-signal-intel">Auth_v1</span>
          </h1>
          <p className="mt-2 text-sm text-text-muted font-interface">
            Enter credentials to initialize secure session.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-md bg-signal-stagnant/10 p-3 text-sm text-signal-stagnant">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="University Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-surface bg-surface text-text-primary placeholder:text-text-muted"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Security Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-surface bg-surface text-text-primary placeholder:text-text-muted"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-signal-intel font-bold text-background hover:bg-signal-intel/90"
          >
            {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted">
          Need access? <Link href="/register" className="text-signal-intel hover:underline font-data">REQUEST_ACCOUNT</Link>
        </p>
        <p className="text-center text-[10px] text-text-muted font-data tracking-widest uppercase opacity-50">
          Institutional Security Protocol // build_2026.03.13
        </p>
      </div>
    </div>
  )
}
