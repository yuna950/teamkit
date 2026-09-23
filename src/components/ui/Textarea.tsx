import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, className, rows = 4, ...props }, ref) => {
    const textarea = (
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={clsx(
          'w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-subtle',
          'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
          className,
        )}
        {...props}
      />
    )

    if (!label) return textarea

    return (
      <label htmlFor={id} className="flex flex-col gap-1.5 text-sm text-muted">
        {label}
        {textarea}
      </label>
    )
  },
)
Textarea.displayName = 'Textarea'
