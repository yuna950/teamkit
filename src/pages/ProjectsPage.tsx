import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Link2, MoreVertical, Pencil, Pin, Plus, Trash2, Users } from 'lucide-react'

import { DdayBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { DatePickerValue } from '@/components/ui/DatePicker'
import { DatePicker } from '@/components/ui/DatePicker'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import type { Project } from '@/projects/ProjectsContext'
import { useProjects } from '@/projects/ProjectsContext'

type SortBy = 'due' | 'name'

function sortProjects(list: Project[], sortBy: SortBy): Project[] {
  const copy = [...list]
  if (sortBy === 'name') {
    copy.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
    return copy
  }
  copy.sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return a.dueDate.getTime() - b.dueDate.getTime()
  })
  return copy
}

const SORT_LABEL: Record<SortBy, string> = {
  due: '마감일 순',
  name: '이름 순',
}

function ProjectCard({
  project,
  onTogglePin,
  onCopyInvite,
  onEdit,
  onDelete,
}: {
  project: Project
  onTogglePin: (id: string) => void
  onCopyInvite: (project: Project) => void
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/projects/${project.id}/dashboard`}
          className="font-bold text-ink hover:text-brand-600"
        >
          {project.name}
        </Link>
        <div className="flex shrink-0 items-center">
          <IconButton
            aria-label={project.pinned ? '고정 해제' : '고정'}
            size="sm"
            onClick={() => onTogglePin(project.id)}
          >
            <Pin size={16} className={project.pinned ? 'fill-current text-warning' : 'text-subtle'} />
          </IconButton>
          <Dropdown
            align="right"
            trigger={
              <IconButton aria-label="더보기" size="sm">
                <MoreVertical size={16} />
              </IconButton>
            }
          >
            <DropdownItem onClick={() => onCopyInvite(project)}>
              <Link2 size={14} />
              초대 링크 복사
            </DropdownItem>
            <DropdownItem onClick={() => onEdit(project)}>
              <Pencil size={14} />
              수정
            </DropdownItem>
            <DropdownItem onClick={() => onDelete(project.id)} tone="danger">
              <Trash2 size={14} />
              삭제
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <p className="min-h-10 text-sm text-muted">{project.description || '설명이 없습니다.'}</p>

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="flex items-center gap-1 text-sm text-subtle">
          <Users size={14} />
          {project.memberCount}명
        </span>
        {project.dueDate ? <DdayBadge dueDate={project.dueDate} /> : null}
      </div>
    </Card>
  )
}

export function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject, togglePin, ensureInviteToken } = useProjects()
  const [pinnedSort, setPinnedSort] = useState<SortBy>('due')
  const [mySort, setMySort] = useState<SortBy>('due')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDueDate, setNewDueDate] = useState<DatePickerValue | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const { toast } = useToast()

  const pinnedProjects = useMemo(
    () => sortProjects(projects.filter((p) => p.pinned), pinnedSort),
    [projects, pinnedSort],
  )
  const myProjects = useMemo(
    () => sortProjects(projects.filter((p) => !p.pinned), mySort),
    [projects, mySort],
  )

  const requestDelete = (id: string) => {
    const project = projects.find((p) => p.id === id)
    if (project) setDeleteTarget(project)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteProject(deleteTarget.id)
    setDeleteTarget(null)
  }

  const copyInviteLink = async (project: Project) => {
    const token = ensureInviteToken(project.id)
    const url = `${window.location.origin}/invite/${token}`
    try {
      await navigator.clipboard.writeText(url)
      toast('초대 링크가 복사되었습니다.')
    } catch {
      toast('링크 복사에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setNewName('')
    setNewDescription('')
    setNewDueDate(null)
  }

  const openCreateModal = () => {
    resetForm()
    setModalOpen(true)
  }

  const openEditModal = (project: Project) => {
    setEditingId(project.id)
    setNewName(project.name)
    setNewDescription(project.description)
    setNewDueDate(project.dueDate ? { date: project.dueDate, time: null } : null)
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!newName.trim()) return

    const input = {
      name: newName.trim(),
      description: newDescription.trim(),
      dueDate: newDueDate?.date ?? null,
    }

    if (editingId) {
      updateProject(editingId, input)
    } else {
      addProject(input)
    }

    setModalOpen(false)
    resetForm()
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      {pinnedProjects.length > 0 ? (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-ink">
              <Pin size={20} className="fill-current text-warning" />
              고정된 프로젝트
            </h2>
            <Dropdown trigger={<Button variant="outline" size="sm">{SORT_LABEL[pinnedSort]} ▾</Button>}>
              <DropdownItem onClick={() => setPinnedSort('due')}>마감일 순</DropdownItem>
              <DropdownItem onClick={() => setPinnedSort('name')}>이름 순</DropdownItem>
            </Dropdown>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onTogglePin={togglePin}
                onCopyInvite={copyInviteLink}
                onEdit={openEditModal}
                onDelete={requestDelete}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-ink">나의 프로젝트</h2>
            <Dropdown trigger={<Button variant="outline" size="sm">{SORT_LABEL[mySort]} ▾</Button>}>
              <DropdownItem onClick={() => setMySort('due')}>마감일 순</DropdownItem>
              <DropdownItem onClick={() => setMySort('name')}>이름 순</DropdownItem>
            </Dropdown>
          </div>
          <Button size="sm" onClick={openCreateModal}>
            <Plus size={16} />새 프로젝트 생성하기
          </Button>
        </div>

        {myProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onTogglePin={togglePin}
                onCopyInvite={copyInviteLink}
                onEdit={openEditModal}
                onDelete={requestDelete}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-subtle">
            아직 참여 중인 프로젝트가 없습니다. 새 프로젝트를 만들어보세요.
          </p>
        )}
      </section>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          resetForm()
        }}
        title={editingId ? '프로젝트 정보 수정' : '새 프로젝트 생성'}
        footer={
          <Button fullWidth disabled={!newName.trim()} onClick={handleSave}>
            저장
          </Button>
        }
      >
        <Input label="프로젝트 이름" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="프로젝트 이름을 입력하세요" />
        <Textarea
          label="설명"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="프로젝트를 소개해주세요"
          rows={3}
        />
        <div className="flex flex-col gap-1.5 text-sm text-muted">
          마감일
          <DatePicker value={newDueDate} onChange={setNewDueDate} placeholder="마감일 선택" />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="프로젝트를 삭제하시겠습니까?"
        description="삭제한 프로젝트는 다시 되돌릴 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
