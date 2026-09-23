import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, label, id, className, ...props }, ref) => {
    const input = (
      <div className="relative flex items-center">
        <input
          ref={ref}
          id={id}
          className={clsx(
            'h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-ink placeholder:text-subtle',
            'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
            icon && 'pr-10',
            className,
          )}
          {...props}
        />
        {icon ? (
          <span className="pointer-events-none absolute right-3 text-subtle">{icon}</span>
        ) : null}
      </div>
    )

    if (!label) return input

    return (
      <label htmlFor={id} className="flex flex-col gap-1.5 text-sm text-muted">
        {label}
        {input}
      </label>
    )
  },
)
Input.displayName = 'Input'
