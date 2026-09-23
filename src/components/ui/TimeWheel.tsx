import { WheelColumn } from '@/components/ui/WheelColumn'

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1))
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
const MERIDIEM_OPTIONS = ['AM', 'PM']

export interface TimeWheelProps {
  /** 24시간 형식 "HH:mm" */
  value: string
  onChange: (value: string) => void
}

function to12Hour(hhmm: string): { hour: string; minute: string; meridiem: string } {
  const [h, m] = hhmm.split(':').map(Number)
  const meridiem = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return { hour: String(hour12), minute: String(m).padStart(2, '0'), meridiem }
}

function to24Hour(hour: string, minute: string, meridiem: string): string {
  let h = Number(hour) % 12
  if (meridiem === 'PM') h += 12
  return `${String(h).padStart(2, '0')}:${minute}`
}

export function TimeWheel({ value, onChange }: TimeWheelProps) {
  const { hour, minute, meridiem } = to12Hour(value)

  return (
    <div className="relative flex justify-center gap-2 rounded-xl bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-8 -translate-y-1/2 rounded-xl bg-brand-50" />
      <WheelColumn options={HOUR_OPTIONS} value={hour} onChange={(h) => onChange(to24Hour(h, minute, meridiem))} className="w-12" />
      <WheelColumn
        options={MINUTE_OPTIONS}
        value={minute}
        onChange={(m) => onChange(to24Hour(hour, m, meridiem))}
        className="w-12"
      />
      <WheelColumn
        options={MERIDIEM_OPTIONS}
        value={meridiem}
        onChange={(mer) => onChange(to24Hour(hour, minute, mer))}
        className="w-14"
      />
    </div>
  )
}
