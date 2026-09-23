import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * 프로젝트별 자료 목록. 대시보드 탭("고정된 자료")과 자료 탭이 같은 데이터를 공유한다.
 * Phase 5에서 Supabase 연동으로 교체 예정.
 */
export type MaterialStage = '기획' | '자료조사' | '발표준비'
export type AttachmentKind = 'file' | 'link'

export interface Attachment {
  id: string
  kind: AttachmentKind
  /** 파일이면 파일명, 링크면 URL */
  name: string
  /** 파일일 때만 사용 (bytes) */
  size?: number
  pinned: boolean
}

export interface Material {
  id: string
  projectId: string
  stage: MaterialStage
  title: string
  memo: string
  authorName: string
  createdAt: Date
  attachments: Attachment[]
}

export interface MaterialInput {
  projectId: string
  stage: MaterialStage
  title: string
  memo: string
  authorName: string
  attachments: { kind: AttachmentKind; name: string; size?: number }[]
}

export interface PinnedAttachment {
  material: Material
  attachment: Attachment
}

interface MaterialsContextValue {
  materials: Material[]
  getMaterialsByProject: (projectId: string) => Material[]
  getPinnedAttachments: (projectId: string) => PinnedAttachment[]
  addMaterial: (input: MaterialInput) => void
  deleteMaterial: (id: string) => void
  toggleAttachmentPin: (materialId: string, attachmentId: string) => void
}

const MaterialsContext = createContext<MaterialsContextValue | null>(null)

function daysAgo(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

const INITIAL_MATERIALS: Material[] = [
  {
    id: 'm1',
    projectId: '1',
    stage: '자료조사',
    title: 'ㄱ파트 자료조사 3차',
    memo: '경쟁사 마케팅 사례 정리',
    authorName: '김철수',
    createdAt: daysAgo(1),
    attachments: [{ id: 'a1', kind: 'file', name: '경쟁사분석.pdf', size: 842_000, pinned: true }],
  },
  {
    id: 'm2',
    projectId: '1',
    stage: '자료조사',
    title: 'ㄴ파트 자료조사 3차',
    memo: '',
    authorName: '이영희',
    createdAt: daysAgo(2),
    attachments: [{ id: 'a2', kind: 'file', name: '설문결과.pdf', size: 512_000, pinned: false }],
  },
  {
    id: 'm3',
    projectId: '1',
    stage: '기획',
    title: '초기 기획안',
    memo: '팀 전체 킥오프 자료',
    authorName: '박민수',
    createdAt: daysAgo(6),
    attachments: [
      { id: 'a3', kind: 'link', name: 'https://참고자료.com', pinned: false },
      { id: 'a4', kind: 'file', name: '기획서초안.pdf', size: 1_240_000, pinned: true },
    ],
  },
]

export function MaterialsProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS)

  const getMaterialsByProject = (projectId: string) => materials.filter((m) => m.projectId === projectId)

  const getPinnedAttachments = (projectId: string): PinnedAttachment[] =>
    getMaterialsByProject(projectId).flatMap((material) =>
      material.attachments.filter((a) => a.pinned).map((attachment) => ({ material, attachment })),
    )

  const addMaterial = (input: MaterialInput) => {
    const material: Material = {
      id: crypto.randomUUID(),
      projectId: input.projectId,
      stage: input.stage,
      title: input.title,
      memo: input.memo,
      authorName: input.authorName,
      createdAt: new Date(),
      attachments: input.attachments.map((a) => ({ id: crypto.randomUUID(), ...a, pinned: false })),
    }
    setMaterials((prev) => [material, ...prev])
  }

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id))
  }

  const toggleAttachmentPin = (materialId: string, attachmentId: string) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? {
              ...m,
              attachments: m.attachments.map((a) =>
                a.id === attachmentId ? { ...a, pinned: !a.pinned } : a,
              ),
            }
          : m,
      ),
    )
  }

  return (
    <MaterialsContext.Provider
      value={{ materials, getMaterialsByProject, getPinnedAttachments, addMaterial, deleteMaterial, toggleAttachmentPin }}
    >
      {children}
    </MaterialsContext.Provider>
  )
}

export function useMaterials(): MaterialsContextValue {
  const context = useContext(MaterialsContext)
  if (!context) throw new Error('useMaterials는 MaterialsProvider 내부에서만 사용할 수 있습니다.')
  return context
}
