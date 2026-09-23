import type { InputHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
}

export function Radio({ className, checked, label, id, ...props }: RadioProps) {
  return (
    <label htmlFor={id} className={clsx('inline-flex cursor-pointer items-center gap-2', className)}>
      <input type="radio" id={id} checked={checked} className="peer sr-only" {...props} />
      <span
        className={clsx(
          'flex h-5 w-5 items-center justify-center rounded-full border-2',
          checked ? 'border-brand-600' : 'border-border',
        )}
      >
        {checked ? <span className="h-2.5 w-2.5 rounded-full bg-brand-600" /> : null}
      </span>
      <span className={clsx('text-sm', checked ? 'font-semibold text-brand-600' : 'text-muted')}>
        {label}
      </span>
    </label>
  )
}
