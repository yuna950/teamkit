import { File, FileImage, FileText, Link2 } from 'lucide-react'
import clsx from 'clsx'

export type AttachmentKind = 'file' | 'link'

export interface FileTypeIconProps {
  name: string
  kind?: AttachmentKind
  className?: string
}

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'img', 'svg'])
const TEXT_EXTENSIONS = new Set(['txt', 'md'])
const DOC_EXTENSIONS = new Set(['pdf', 'hwp', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'])

function getExtension(name: string): string {
  const parts = name.split('.')
  return parts.length > 1 ? (parts.at(-1)?.toLowerCase() ?? '') : ''
}

export function FileTypeIcon({ name, kind = 'file', className }: FileTypeIconProps) {
  if (kind === 'link') {
    return (
      <span
        className={clsx(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600',
          className,
        )}
      >
        <Link2 size={18} />
      </span>
    )
  }

  const ext = getExtension(name)
  const Icon = IMAGE_EXTENSIONS.has(ext) ? FileImage : TEXT_EXTENSIONS.has(ext) ? FileText : File
  const label = DOC_EXTENSIONS.has(ext) ? ext.toUpperCase() : null

  return (
    <span
      className={clsx(
        'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-white',
        className,
      )}
    >
      <Icon size={18} />
      {label ? (
        <span className="absolute -bottom-1 rounded bg-ink px-1 text-[8px] font-bold leading-tight">
          {label}
        </span>
      ) : null}
    </span>
  )
}
