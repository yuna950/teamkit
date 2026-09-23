import { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

import { Switch } from '@/components/ui/Switch'
import { TimeWheel } from '@/components/ui/TimeWheel'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const DEFAULT_TIME = '09:00'

export interface DatePickerValue {
  date: Date
  /** "HH:mm" (24시간), 시간을 지정하지 않으면 null */
  time: string | null
}

export interface DatePickerProps {
  value: DatePickerValue | null
  onChange: (value: DatePickerValue | null) => void
  /** true면 "시간 추가" 토글 및 시간 휠 피커를 노출한다 */
  withTime?: boolean
  placeholder?: string
  className?: string
}

function formatTimeKorean(time: string): string {
  const [hh, mm] = time.split(':').map(Number)
  const meridiem = hh >= 12 ? '오후' : '오전'
  const hour12 = hh % 12 === 0 ? 12 : hh % 12
  return `${meridiem} ${hour12}:${String(mm).padStart(2, '0')}`
}

function formatKorean(value: DatePickerValue): string {
  const { date, time } = value
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const weekday = WEEKDAYS[date.getDay()]
  const base = `${y}.${m}.${d} (${weekday})`
  return time ? `${base} ${formatTimeKorean(time)}` : base
}

function buildMonthMatrix(viewDate: Date): (Date | null)[][] {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = firstDay.getDay()

  const cells: (Date | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function DatePicker({ value, onChange, withTime = false, placeholder = '날짜 선택', className }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(value?.date ?? new Date())
  const containerRef = useRef<HTMLDivElement>(null)
  const today = new Date()

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const weeks = buildMonthMatrix(viewDate)

  const handlePickDay = (day: Date) => {
    onChange({ date: day, time: value?.time ?? null })
  }

  const handleToggleTime = (enabled: boolean) => {
    const date = value?.date ?? new Date()
    onChange({ date, time: enabled ? (value?.time ?? DEFAULT_TIME) : null })
  }

  const handleTimeChange = (time: string) => {
    const date = value?.date ?? new Date()
    onChange({ date, time })
  }

  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-border bg-white px-4 text-left text-sm text-ink"
      >
        <span className={value ? 'text-ink' : 'text-subtle'}>{value ? formatKorean(value) : placeholder}</span>
        <Calendar size={18} className="text-brand-500" />
      </button>

      {open ? (
        <div className="absolute z-40 mt-2 w-72 rounded-2xl border border-border bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">
              {viewDate.getFullYear()}.{String(viewDate.getMonth() + 1).padStart(2, '0')}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="이전 달"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                className="rounded p-1 text-muted hover:bg-brand-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="다음 달"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                className="rounded p-1 text-muted hover:bg-brand-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1 font-medium text-subtle">
                {w}
              </span>
            ))}
            {weeks.flatMap((week, wi) =>
              week.map((day, di) => {
                if (!day) return <span key={`${wi}-${di}`} />
                const isToday = isSameDay(day, today)
                const isSelected = value ? isSameDay(day, value.date) : false
                return (
                  <button
                    key={`${wi}-${di}`}
                    type="button"
                    onClick={() => handlePickDay(day)}
                    className={clsx(
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm',
                      isSelected && 'bg-brand-600 font-semibold text-white',
                      isToday && !isSelected && 'bg-brand-50 text-brand-600',
                      !isSelected && !isToday && 'text-ink hover:bg-brand-50',
                    )}
                  >
                    {day.getDate()}
                  </button>
                )
              }),
            )}
          </div>

          {withTime ? (
            <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3">
              <div className="flex w-full items-center justify-between">
                <span className="text-sm text-muted">시간 추가</span>
                <div className="flex items-center gap-2">
                  {value?.time ? (
                    <span className="text-sm font-medium text-ink">{formatTimeKorean(value.time)}</span>
                  ) : null}
                  <Switch checked={!!value?.time} onChange={handleToggleTime} aria-label="시간 추가" />
                </div>
              </div>
              {value?.time ? <TimeWheel value={value.time} onChange={handleTimeChange} /> : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
