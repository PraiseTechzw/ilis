'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/login?message=Registration successful. Please login.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-interface text-3xl font-bold tracking-tighter text-text-primary uppercase">
            ILIS <span className="text-signal-healthy">Register</span>
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Create your innovation profile to begin.
          </p>
        </div>

        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-md bg-signal-stagnant/10 p-3 text-sm text-signal-stagnant">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="border-surface bg-surface text-text-primary placeholder:text-text-muted"
            />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="border-surface bg-surface text-text-primary placeholder:text-text-muted"
            />
          </div>
          <Input
            type="email"
            placeholder="University Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-surface bg-surface text-text-primary placeholder:text-text-muted"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-surface bg-surface text-text-primary placeholder:text-text-muted"
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-signal-healthy font-bold text-background hover:bg-signal-healthy/90"
          >
            {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted">
          Already have an account? <Link href="/login" className="text-signal-intel hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
