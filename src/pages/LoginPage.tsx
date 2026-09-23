import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { TEST_ACCOUNT, useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface LocationState {
  from?: { pathname: string }
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? '/projects'
  const canSubmit = email.trim() !== '' && password.trim() !== ''

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const result = login(email, password)
    if (!result.success) {
      setError(result.error ?? '로그인에 실패했습니다.')
      return
    }
    navigate(redirectTo, { replace: true })
  }

  const handleTestLogin = () => {
    const result = login(TEST_ACCOUNT.email, TEST_ACCOUNT.password)
    if (result.success) navigate(redirectTo, { replace: true })
  }

  return (
    <div className="w-full max-w-sm px-6">
      <h1 className="mb-8 text-center text-xl font-bold tracking-wide text-ink">TEAMKIT</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" fullWidth disabled={!canSubmit}>
          로그인
        </Button>
      </form>

      <Button variant="outline" fullWidth className="mt-3" onClick={handleTestLogin}>
        테스트 계정으로 로그인
      </Button>

      <p className="mt-6 text-center text-sm text-muted">
        계정이 없나요?{' '}
        <Link to="/signup" className="font-semibold text-brand-600">
          회원가입
        </Link>
      </p>
    </div>
  )
}
