import clsx from 'clsx'

export interface TabItem<T extends string = string> {
  value: T
  label: string
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function Tabs<T extends string = string>({ items, value, onChange, className }: TabsProps<T>) {
  return (
    <div className={clsx('flex items-center gap-5 border-b border-border', className)}>
      {items.map((item) => {
        const isActive = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={clsx(
              '-mb-px border-b-2 pb-2 text-sm transition-colors',
              isActive
                ? 'border-brand-600 font-semibold text-brand-600'
                : 'border-transparent text-subtle hover:text-muted',
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
