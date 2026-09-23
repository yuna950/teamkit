import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Info, X } from 'lucide-react'
import clsx from 'clsx'

type ToastTone = 'default' | 'success'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let idCounter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, tone: ToastTone = 'default') => {
    const id = idCounter++
    setItems((prev) => [...prev, { id, message, tone }])
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }, 3000)
  }, [])

  const dismiss = (id: number) => setItems((prev) => prev.filter((item) => item.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-16 left-1/2 z-[200] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={clsx(
                'flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg',
                item.tone === 'success' ? 'bg-ink text-white' : 'bg-ink text-white',
              )}
            >
              {item.tone === 'success' ? (
                <CheckCircle2 size={16} className="text-success" />
              ) : (
                <Info size={16} className="text-brand-500" />
              )}
              <span className="flex-1">{item.message}</span>
              <button type="button" onClick={() => dismiss(item.id)} aria-label="닫기">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast는 ToastProvider 내부에서만 사용할 수 있습니다.')
  return context
}
