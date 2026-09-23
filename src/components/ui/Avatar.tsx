import clsx from 'clsx'

export interface AvatarProps {
  name?: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const initial = name?.trim().charAt(0) ?? ''

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? ''}
        className={clsx('shrink-0 rounded-full object-cover', SIZE_CLASSES[size], className)}
      />
    )
  }

  return (
    <span
      className={clsx(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-border font-semibold text-muted',
        SIZE_CLASSES[size],
        className,
      )}
    >
      {initial}
    </span>
  )
}
