import { useEffect, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import clsx from 'clsx'

const ITEM_HEIGHT = 32
const VISIBLE_COUNT = 5
const PAD_COUNT = Math.floor(VISIBLE_COUNT / 2)

export interface WheelColumnProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  className?: string
}

/**
 * 네이티브 CSS scroll-snap 기반 휠(드럼) 피커 한 컬럼.
 * 터치 드래그 관성/스냅은 브라우저가 처리하고, 데스크톱 마우스 드래그만 별도로 지원한다.
 */
export function WheelColumn({ options, value, onChange, className }: WheelColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const settleTimerRef = useRef<number | undefined>(undefined)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ y: 0, scrollTop: 0 })

  const selectedIndex = Math.max(0, options.indexOf(value))

  // 값이 바깥에서 바뀌면(초기 진입 등) 드래그 중이 아닐 때만 해당 위치로 스크롤 이동
  useEffect(() => {
    if (isDraggingRef.current) return
    containerRef.current?.scrollTo({ top: selectedIndex * ITEM_HEIGHT, behavior: 'auto' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex])

  const settleToNearest = () => {
    const el = containerRef.current
    if (!el) return
    const nearestIndex = Math.min(options.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM_HEIGHT)))
    el.scrollTo({ top: nearestIndex * ITEM_HEIGHT, behavior: 'smooth' })
    const next = options[nearestIndex]
    if (next !== value) onChange(next)
  }

  const handleScroll = () => {
    if (isDraggingRef.current) return
    window.clearTimeout(settleTimerRef.current)
    settleTimerRef.current = window.setTimeout(settleToNearest, 120)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    isDraggingRef.current = true
    dragStartRef.current = { y: event.clientY, scrollTop: el.scrollTop }
    el.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return
    const delta = event.clientY - dragStartRef.current.y
    containerRef.current.scrollTop = dragStartRef.current.scrollTop - delta
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    isDraggingRef.current = false
    containerRef.current.releasePointerCapture(event.pointerId)
    settleToNearest()
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={clsx(
        'no-scrollbar cursor-grab touch-pan-y snap-y snap-mandatory overflow-y-scroll select-none active:cursor-grabbing',
        className,
      )}
      style={{ height: ITEM_HEIGHT * VISIBLE_COUNT, paddingBlock: ITEM_HEIGHT * PAD_COUNT }}
    >
      {options.map((option) => (
        <div
          key={option}
          className={clsx(
            'flex snap-center items-center justify-center text-base tabular-nums transition-colors',
            option === value ? 'font-bold text-ink' : 'text-subtle',
          )}
          style={{ height: ITEM_HEIGHT }}
        >
          {option}
        </div>
      ))}
    </div>
  )
}
