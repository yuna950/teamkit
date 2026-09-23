import type { InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import clsx from 'clsx'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export function Checkbox({ className, checked, ...props }: CheckboxProps) {
  return (
    <label className={clsx('relative inline-flex h-5 w-5 shrink-0 cursor-pointer', className)}>
      <input type="checkbox" checked={checked} className="peer sr-only" {...props} />
      <span
        className={clsx(
          'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors',
          checked ? 'border-brand-600 bg-brand-600' : 'border-border bg-white',
        )}
      >
        {checked ? <Check size={14} strokeWidth={3} className="text-white" /> : null}
      </span>
    </label>
  )
}
