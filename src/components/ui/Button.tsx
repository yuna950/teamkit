import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type ButtonVariant = 'solid' | 'soft' | 'outline' | 'danger'
type ButtonSize = 'sm' | 'md'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  solid: 'bg-brand-600 text-white hover:brightness-90 active:brightness-75',
  soft: 'bg-brand-50 text-brand-600 border border-brand-500/30 hover:bg-brand-50/70',
  outline: 'bg-white text-muted border border-border hover:border-subtle',
  danger: 'bg-danger text-white hover:brightness-90 active:brightness-75',
}

// 저장 버튼처럼 필수값이 채워지기 전까지 비활성 상태인 solid 버튼은
// "흐린(soft) 배경 → 채우면 solid" 패턴을 쓰므로, disabled일 땐 soft 톤으로 보이게 한다.
const SOLID_DISABLED_CLASSES = 'bg-brand-50 text-brand-600 border border-brand-500/30'

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-12 px-4 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'solid', size = 'md', fullWidth, className, type = 'button', disabled, ...props }, ref) => {
    const isSolidDisabled = variant === 'solid' && disabled

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed',
          isSolidDisabled ? SOLID_DISABLED_CLASSES : VARIANT_CLASSES[variant],
          !isSolidDisabled && 'disabled:opacity-50',
          SIZE_CLASSES[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
