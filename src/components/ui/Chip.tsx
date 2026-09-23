import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

export function Chip({ selected, className, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={clsx(
        'inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors',
        selected
          ? 'border-brand-500 bg-white text-brand-600'
          : 'border-border bg-white text-subtle hover:border-subtle',
        className,
      )}
      {...props}
    />
  )
}
