import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * 프로젝트별 체크리스트(공통/개인). 대시보드 탭 요약과 체크리스트 탭이 같은 데이터를 공유한다.
 * Phase 5에서 Supabase 연동으로 교체 예정.
 */
export type ChecklistScope = 'common' | 'personal'

export interface ChecklistItem {
  id: string
  projectId: string
  scope: ChecklistScope
  /** personal 항목의 소유자 이메일. common 항목은 null(담당자 없이 전원 공유) */
  ownerEmail: string | null
  task: string
  memo: string
  dueDate: Date | null
  /** "HH:mm" (24시간). 지정 안 했으면 null */
  dueTime: string | null
  done: boolean
}

export interface ChecklistItemInput {
  projectId: string
  scope: ChecklistScope
  ownerEmail: string | null
  task: string
  memo: string
  dueDate: Date | null
  dueTime: string | null
}

interface ChecklistContextValue {
  items: ChecklistItem[]
  getItems: (projectId: string, scope: ChecklistScope, ownerEmail?: string | null) => ChecklistItem[]
  addItem: (input: ChecklistItemInput) => void
  toggleDone: (id: string) => void
  deleteItem: (id: string) => void
}

const ChecklistContext = createContext<ChecklistContextValue | null>(null)

function daysFromNow(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

const TEST_EMAIL = 'test@teamkit.com'

const INITIAL_ITEMS: ChecklistItem[] = [
  {
    id: 'c1',
    projectId: '1',
    scope: 'common',
    ownerEmail: null,
    task: '발표 자료 초안 작성',
    memo: '',
    dueDate: daysFromNow(3),
    dueTime: null,
    done: false,
  },
  {
    id: 'c2',
    projectId: '1',
    scope: 'common',
    ownerEmail: null,
    task: '경쟁사 조사 취합',
    memo: '팀원별 조사 내용 한 문서로 정리',
    dueDate: daysFromNow(5),
    dueTime: null,
    done: false,
  },
  {
    id: 'c3',
    projectId: '1',
    scope: 'common',
    ownerEmail: null,
    task: '킥오프 회의 일정 잡기',
    memo: '',
    dueDate: daysFromNow(1),
    dueTime: null,
    done: true,
  },
  {
    id: 'c4',
    projectId: '1',
    scope: 'personal',
    ownerEmail: TEST_EMAIL,
    task: '자료조사 담당 파트 정리',
    memo: '',
    dueDate: daysFromNow(3),
    dueTime: null,
    done: false,
  },
  {
    id: 'c5',
    projectId: '1',
    scope: 'personal',
    ownerEmail: TEST_EMAIL,
    task: '발표 스크립트 초안',
    memo: '',
    dueDate: daysFromNow(7),
    dueTime: '14:00',
    done: false,
  },
  {
    id: 'c6',
    projectId: '1',
    scope: 'personal',
    ownerEmail: TEST_EMAIL,
    task: '참고 논문 3개 요약',
    memo: '',
    dueDate: daysFromNow(-1),
    dueTime: null,
    done: false,
  },
]

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_ITEMS)

  const getItems = (projectId: string, scope: ChecklistScope, ownerEmail?: string | null) =>
    items.filter(
      (item) =>
        item.projectId === projectId &&
        item.scope === scope &&
        (scope === 'common' || item.ownerEmail === ownerEmail),
    )

  const addItem = (input: ChecklistItemInput) => {
    const item: ChecklistItem = { id: crypto.randomUUID(), done: false, ...input }
    setItems((prev) => [...prev, item])
  }

  const toggleDone = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))
  }

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <ChecklistContext.Provider value={{ items, getItems, addItem, toggleDone, deleteItem }}>
      {children}
    </ChecklistContext.Provider>
  )
}

export function useChecklist(): ChecklistContextValue {
  const context = useContext(ChecklistContext)
  if (!context) throw new Error('useChecklist는 ChecklistProvider 내부에서만 사용할 수 있습니다.')
  return context
}
