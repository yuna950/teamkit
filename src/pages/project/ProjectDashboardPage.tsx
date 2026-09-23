import { useParams } from 'react-router-dom'
import { Download, Pin } from 'lucide-react'
import clsx from 'clsx'

import { useAuth } from '@/auth/AuthContext'
import { DdayBadge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import { FileTypeIcon } from '@/components/ui/FileTypeIcon'
import type { ChecklistItem } from '@/checklist/ChecklistContext'
import { useChecklist } from '@/checklist/ChecklistContext'
import { useMaterials } from '@/materials/MaterialsContext'

function sortChecklist(items: ChecklistItem[]): ChecklistItem[] {
  const copy = [...items]
  copy.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return a.dueDate.getTime() - b.dueDate.getTime()
  })
  return copy
}

function formatBytes(bytes?: number): string {
  if (!bytes) return ''
  return `${(bytes / 1_000_000).toFixed(2)}MB`
}

function ChecklistCard({ title, items, onToggle }: { title: string; items: ChecklistItem[]; onToggle: (id: string) => void }) {
  return (
    <Card className="flex flex-col gap-1">
      <h3 className="mb-2 text-base font-bold text-ink">{title}</h3>
      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-subtle">할 일이 없습니다.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="flex items-start gap-2 rounded-lg px-1 py-2">
            <Checkbox checked={item.done} onChange={() => onToggle(item.id)} className="mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className={clsx('truncate text-sm', item.done ? 'text-subtle line-through' : 'text-ink')}>
                {item.task}
              </p>
              {item.memo ? <p className="truncate text-xs text-subtle">{item.memo}</p> : null}
            </div>
            {!item.done && item.dueDate ? <DdayBadge dueDate={item.dueDate} className="shrink-0" /> : null}
          </div>
        ))
      )}
    </Card>
  )
}

export function ProjectDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { user } = useAuth()
  const { getItems, toggleDone } = useChecklist()
  const { getPinnedAttachments } = useMaterials()

  if (!projectId) return null

  const commonItems = sortChecklist(getItems(projectId, 'common'))
  const personalItems = sortChecklist(getItems(projectId, 'personal', user?.email))
  const pinnedAttachments = getPinnedAttachments(projectId)

  return (
    <div className="p-8">
      <h1 className="mb-8 text-3xl font-bold text-ink">대시보드</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-2xl font-bold text-ink">체크리스트</h2>
          <div className="flex flex-col gap-4">
            <ChecklistCard title="공통" items={commonItems} onToggle={toggleDone} />
            <ChecklistCard title="개인" items={personalItems} onToggle={toggleDone} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold text-ink">
            <Pin size={20} className="fill-current text-warning" />
            고정된 자료
          </h2>
          <Card className="flex flex-col gap-1">
            {pinnedAttachments.length === 0 ? (
              <p className="py-4 text-center text-sm text-subtle">고정된 자료가 없습니다.</p>
            ) : (
              pinnedAttachments.map(({ material, attachment }) => (
                <div key={attachment.id} className="flex items-center gap-3 rounded-lg px-1 py-2">
                  <FileTypeIcon name={attachment.name} kind={attachment.kind} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{attachment.name}</p>
                    <p className="truncate text-xs text-subtle">
                      {material.authorName}님 · {formatBytes(attachment.size)}
                    </p>
                  </div>
                  <Download size={16} className="shrink-0 text-subtle" />
                </div>
              ))
            )}
          </Card>
        </section>
      </div>
    </div>
  )
}
