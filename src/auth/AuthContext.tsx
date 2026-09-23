import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * 임시(mock) 인증. Supabase 연동 전까지 로컬 스토리지만으로 로그인 상태를 흉내낸다.
 * Phase 5에서 실제 Supabase Auth로 교체 예정.
 */
export interface AuthUser {
  email: string
  name: string
}

interface StoredAccount extends AuthUser {
  password: string
}

interface AuthResult {
  success: boolean
  error?: string
}

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => AuthResult
  signup: (email: string, password: string, name: string) => AuthResult
  logout: () => void
}

const SESSION_KEY = 'teamkit:auth:session'
const ACCOUNTS_KEY = 'teamkit:auth:accounts'

export const TEST_ACCOUNT = { email: 'test@teamkit.com', password: 'test1234', name: '테스트 계정' }

const SEED_ACCOUNTS: StoredAccount[] = [TEST_ACCOUNT]

function loadAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(SEED_ACCOUNTS))
      return SEED_ACCOUNTS
    }
    return JSON.parse(raw) as StoredAccount[]
  } catch {
    return SEED_ACCOUNTS
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch {
    // 로컬 스토리지를 쓸 수 없는 환경이면 이번 세션 동안만 유지됨
  }
}

function loadSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadSession())

  useEffect(() => {
    try {
      if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
      else localStorage.removeItem(SESSION_KEY)
    } catch {
      // 무시: 로컬 스토리지 접근 불가 환경
    }
  }, [user])

  const login = (email: string, password: string): AuthResult => {
    const account = loadAccounts().find((a) => a.email.toLowerCase() === email.trim().toLowerCase())
    if (!account || account.password !== password) {
      return { success: false, error: '이메일 또는 비밀번호가 일치하지 않습니다.' }
    }
    setUser({ email: account.email, name: account.name })
    return { success: true }
  }

  const signup = (email: string, password: string, name: string): AuthResult => {
    const accounts = loadAccounts()
    if (accounts.some((a) => a.email.toLowerCase() === email.trim().toLowerCase())) {
      return { success: false, error: '이미 가입된 이메일입니다.' }
    }
    saveAccounts([...accounts, { email: email.trim(), password, name: name.trim() }])
    setUser({ email: email.trim(), name: name.trim() })
    return { success: true }
  }

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.')
  return context
}
