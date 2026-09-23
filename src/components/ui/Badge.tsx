import type { ReactNode } from 'react'
import clsx from 'clsx'

export type BadgeTone = 'danger' | 'warning' | 'neutral' | 'success' | 'brand'

export interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  danger: 'bg-danger-bg text-danger',
  warning: 'bg-warning-bg text-warning',
  neutral: 'bg-border text-muted',
  success: 'bg-success/10 text-success',
  brand: 'bg-brand-50 text-brand-600',
}

export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/** 마감일까지 남은 일수 기준 배지 톤. 3일 이내(연체 포함)=danger, 4~7일=warning, 그 외=neutral */
export function getDdayTone(diffDays: number): BadgeTone {
  if (diffDays <= 3) return 'danger'
  if (diffDays <= 7) return 'warning'
  return 'neutral'
}

export function formatDday(diffDays: number): string {
  if (diffDays === 0) return 'D-DAY'
  if (diffDays > 0) return `D-${diffDays}`
  return `D+${Math.abs(diffDays)}`
}

export interface DdayBadgeProps {
  dueDate: Date
  className?: string
}

export function DdayBadge({ dueDate, className }: DdayBadgeProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Badge tone={getDdayTone(diffDays)} className={className}>
      {formatDday(diffDays)}
    </Badge>
  )
}
