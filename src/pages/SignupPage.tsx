import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  const passwordMismatch = passwordConfirm !== '' && password !== passwordConfirm
  const canSubmit = name.trim() !== '' && email.trim() !== '' && password !== '' && password === passwordConfirm

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const result = signup(email, password, name)
    if (!result.success) {
      setError(result.error ?? '회원가입에 실패했습니다.')
      return
    }
    navigate('/projects', { replace: true })
  }

  return (
    <div className="w-full max-w-sm px-6">
      <h1 className="mb-8 text-center text-xl font-bold tracking-wide text-ink">TEAMKIT</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="이름" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" />
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
        <Input
          label="비밀번호 확인"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="비밀번호 확인"
        />
        {passwordMismatch ? <p className="text-sm text-danger">비밀번호가 일치하지 않습니다.</p> : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" fullWidth disabled={!canSubmit}>
          회원가입
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        이미 계정이 있나요?{' '}
        <Link to="/login" className="font-semibold text-brand-600">
          로그인
        </Link>
      </p>
    </div>
  )
}
