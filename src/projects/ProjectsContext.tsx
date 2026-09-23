import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * 마이대시보드 + 프로젝트 상세(사이드바 전환 드롭다운 등)가 같은 프로젝트 목록을 봐야 해서
 * 더미 데이터를 여기 하나로 모아 공유한다. Phase 5에서 Supabase 연동으로 교체 예정.
 */
export interface Project {
  id: string
  name: string
  description: string
  dueDate: Date | null
  memberCount: number
  pinned: boolean
  /** 아직 발급된 적 없으면 null. 첫 "링크 복사" 시점에 발급된다. */
  inviteToken: string | null
}

export interface ProjectInput {
  name: string
  description: string
  dueDate: Date | null
}

interface ProjectsContextValue {
  projects: Project[]
  getProject: (id: string) => Project | undefined
  addProject: (input: ProjectInput) => void
  updateProject: (id: string, input: ProjectInput) => void
  deleteProject: (id: string) => void
  togglePin: (id: string) => void
  /** 초대 토큰이 없으면 새로 발급하고, 있으면 기존 토큰을 그대로 반환한다 */
  ensureInviteToken: (id: string) => string
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null)

function addDays(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    name: '마케팅 팀플',
    description: '캡스톤 디자인 마케팅 전략 수립 프로젝트',
    dueDate: addDays(3),
    memberCount: 4,
    pinned: true,
    inviteToken: null,
  },
  {
    id: '2',
    name: 'UX 리서치 스터디',
    description: '사용자 인터뷰 및 설문 분석',
    dueDate: addDays(30),
    memberCount: 3,
    pinned: true,
    inviteToken: null,
  },
  {
    id: '3',
    name: '캡스톤 디자인',
    description: '졸업 프로젝트 발표 준비',
    dueDate: addDays(5),
    memberCount: 5,
    pinned: false,
    inviteToken: null,
  },
  {
    id: '4',
    name: '알고리즘 스터디',
    description: '매주 문제풀이 및 코드리뷰',
    dueDate: addDays(8),
    memberCount: 4,
    pinned: false,
    inviteToken: null,
  },
  {
    id: '5',
    name: '창업 동아리 기획',
    description: '',
    dueDate: addDays(8),
    memberCount: 6,
    pinned: false,
    inviteToken: null,
  },
]

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)

  const getProject = (id: string) => projects.find((p) => p.id === id)

  const addProject = (input: ProjectInput) => {
    const project: Project = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      dueDate: input.dueDate,
      memberCount: 1,
      pinned: false,
      inviteToken: null,
    }
    setProjects((prev) => [...prev, project])
  }

  const updateProject = (id: string, input: ProjectInput) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...input } : p)))
  }

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  const togglePin = (id: string) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p)))
  }

  const ensureInviteToken = (id: string): string => {
    const existing = projects.find((p) => p.id === id)?.inviteToken
    if (existing) return existing

    const token = crypto.randomUUID()
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, inviteToken: token } : p)))
    return token
  }

  return (
    <ProjectsContext.Provider
      value={{ projects, getProject, addProject, updateProject, deleteProject, togglePin, ensureInviteToken }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects(): ProjectsContextValue {
  const context = useContext(ProjectsContext)
  if (!context) throw new Error('useProjects는 ProjectsProvider 내부에서만 사용할 수 있습니다.')
  return context
}
