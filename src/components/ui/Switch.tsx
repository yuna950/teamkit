import clsx from 'clsx'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  'aria-label'?: string
}

export function Switch({ checked, onChange, className, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        checked ? 'bg-brand-600' : 'bg-border',
        className,
      )}
      {...props}
    >
      <span
        className={clsx(
          'absolute inset-y-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  )
}
