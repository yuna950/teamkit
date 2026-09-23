import { Link } from 'react-router-dom'

import { useAuth } from '@/auth/AuthContext'

/**
 * 임시 개발용 내비게이션.
 * 실제 페이지들에 정식 내비게이션(로그인 흐름 포함)이 갖춰지면 제거 예정.
 */
const DEV_LINKS: { label: string; to: string }[] = [
  { label: '로그인', to: '/login' },
  { label: '회원가입', to: '/signup' },
  { label: '초대(샘플)', to: '/invite/sample-token' },
  { label: '초대 만료', to: '/invite/expired' },
  { label: '마이대시보드', to: '/projects' },
  { label: '마이페이지', to: '/my-page' },
  { label: '프로젝트-대시보드', to: '/projects/1/dashboard' },
  { label: '프로젝트-자료', to: '/projects/1/materials' },
  { label: '프로젝트-체크리스트', to: '/projects/1/checklist' },
  { label: '프로젝트-회의록', to: '/projects/1/minutes' },
  { label: '프로젝트-회의록 작성', to: '/projects/1/minutes/new' },
  { label: '프로젝트-설정', to: '/projects/1/settings' },
  { label: 'UI 컴포넌트 모음', to: '/dev/ui-kit' },
]

export function DevNav() {
  const { user, logout } = useAuth()

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-wrap items-center gap-2 border-t border-border bg-white/95 px-3 py-2 text-xs shadow-[0_-2px_8px_rgba(0,0,0,0.06)] backdrop-blur">
      <span className="mr-1 font-semibold text-subtle">DEV 이동:</span>
      {DEV_LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="rounded-full border border-border px-2 py-0.5 text-muted hover:border-brand-500 hover:text-brand-600"
        >
          {link.label}
        </Link>
      ))}

      <span className="ml-auto flex items-center gap-2">
        {user ? (
          <>
            <span className="text-subtle">{user.name} ({user.email}) 로그인됨</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-border px-2 py-0.5 text-muted hover:border-danger hover:text-danger"
            >
              로그아웃
            </button>
          </>
        ) : (
          <span className="text-subtle">로그인 안 됨</span>
        )}
      </span>
    </div>
  )
}
