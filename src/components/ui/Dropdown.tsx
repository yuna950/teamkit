import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react'
import clsx from 'clsx'

export interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, children, align = 'left', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const toggleOpen = () => setOpen((prev) => !prev)

  // trigger는 보통 이미 Button/IconButton(=<button>)이므로, 여기서 또 <button>으로 감싸면
  // HTML 규격상 허용되지 않는 button-in-button이 된다. 대신 onClick만 얹어서 그대로 렌더링한다.
  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<{ onClick?: () => void }>, { onClick: toggleOpen })
    : trigger

  return (
    <div ref={containerRef} className={clsx('relative inline-block', className)}>
      {triggerElement}
      {open ? (
        <div
          className={clsx(
            'absolute z-40 mt-2 min-w-40 rounded-xl border border-border bg-white p-1.5 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

export interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 'danger'면 삭제처럼 되돌릴 수 없는 항목임을 빨간 텍스트로 표시 (hover해도 보라색으로 안 바뀜) */
  tone?: 'default' | 'danger'
}

export function DropdownItem({ className, tone = 'default', ...props }: DropdownItemProps) {
  return (
    <button
      type="button"
      className={clsx(
        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
        tone === 'danger' ? 'text-danger hover:bg-danger-bg' : 'text-muted hover:bg-brand-50 hover:text-brand-600',
        className,
      )}
      {...props}
    />
  )
}
