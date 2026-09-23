import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Download, MoreVertical, Pin, Plus, Search } from 'lucide-react'

import { Avatar } from '@/components/ui/Avatar'
import { Badge, DdayBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import { Chip } from '@/components/ui/Chip'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { DatePicker } from '@/components/ui/DatePicker'
import type { DatePickerValue } from '@/components/ui/DatePicker'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { FileTypeIcon } from '@/components/ui/FileTypeIcon'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Radio } from '@/components/ui/Radio'
import { Tabs } from '@/components/ui/Tab'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-subtle">{title}</h2>
      <Card className="flex flex-wrap items-center gap-4">{children}</Card>
    </section>
  )
}

export function UiKitPage() {
  const [checked, setChecked] = useState(true)
  const [stage, setStage] = useState<'plan' | 'research' | 'ready'>('research')
  const [tab, setTab] = useState<'all' | 'plan' | 'research' | 'ready'>('research')
  const [chipSelected, setChipSelected] = useState<string[]>(['김ㅇㅇ'])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [date, setDate] = useState<DatePickerValue | null>({ date: new Date(), time: null })
  const soonDueDate = useMemo(() => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), [])
  const { toast } = useToast()

  const toggleChip = (name: string) => {
    setChipSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]))
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 p-8 pb-24">
      <h1 className="text-3xl font-bold text-ink">UI 컴포넌트 모음 (개발 확인용)</h1>

      <Section title="Button">
        <Button variant="solid">저장 (활성)</Button>
        <Button variant="solid" disabled>
          저장 (비활성 → soft 톤)
        </Button>
        <Button variant="soft">저장 (soft)</Button>
        <Button variant="outline">링크 추가하기</Button>
        <Button variant="danger">삭제</Button>
      </Section>

      <Section title="IconButton">
        <IconButton aria-label="추가" variant="solid">
          <Plus size={22} strokeWidth={2.25} />
        </IconButton>
        <IconButton aria-label="더보기">
          <MoreVertical size={18} />
        </IconButton>
        <IconButton aria-label="고정">
          <Pin size={18} />
        </IconButton>
        <IconButton aria-label="다운로드">
          <Download size={18} />
        </IconButton>
      </Section>

      <Section title="Input / Textarea">
        <Input placeholder="제목" className="w-56" />
        <Input placeholder="작성자나 제목을 검색하세요" icon={<Search size={16} />} className="w-64" />
        <Textarea placeholder="메모" className="w-72" />
      </Section>

      <Section title="Checkbox / Radio">
        <Checkbox checked={checked} onChange={() => setChecked((prev) => !prev)} />
        <div className="flex gap-4">
          <Radio id="stage-plan" label="기획" checked={stage === 'plan'} onChange={() => setStage('plan')} />
          <Radio
            id="stage-research"
            label="자료조사"
            checked={stage === 'research'}
            onChange={() => setStage('research')}
          />
          <Radio id="stage-ready" label="발표준비" checked={stage === 'ready'} onChange={() => setStage('ready')} />
        </div>
      </Section>

      <Section title="Badge / D-day">
        <Badge tone="danger">D-3</Badge>
        <Badge tone="warning">D-5</Badge>
        <Badge tone="neutral">D-30</Badge>
        <Badge tone="brand">공통</Badge>
        <DdayBadge dueDate={soonDueDate} />
      </Section>

      <Section title="Avatar">
        <Avatar name="김철수" size="sm" />
        <Avatar name="이영희" size="md" />
        <Avatar name="박민수" size="lg" />
      </Section>

      <Section title="Chip">
        {['김ㅇㅇ', '이ㅇㅇ', '박ㅇㅇ'].map((name) => (
          <Chip key={name} selected={chipSelected.includes(name)} onClick={() => toggleChip(name)}>
            {name}
          </Chip>
        ))}
      </Section>

      <Section title="Tabs">
        <Tabs
          items={[
            { value: 'all', label: '전체' },
            { value: 'plan', label: '기획' },
            { value: 'research', label: '자료조사' },
            { value: 'ready', label: '발표준비' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </Section>

      <Section title="Dropdown">
        <Dropdown trigger={<Button variant="outline">마감일 순 ▾</Button>}>
          <DropdownItem>마감일 순</DropdownItem>
          <DropdownItem>이름 순</DropdownItem>
          <DropdownItem>최신 순</DropdownItem>
        </Dropdown>
      </Section>

      <Section title="DatePicker">
        <DatePicker value={date} onChange={setDate} withTime className="w-64" />
      </Section>

      <Section title="FileTypeIcon">
        <FileTypeIcon name="asdfasdf.pdf" />
        <FileTypeIcon name="asdfasdf.png" />
        <FileTypeIcon name="asdfasdf.hwp" />
        <FileTypeIcon name="asdfasdf.txt" />
        <FileTypeIcon name="https://example.com" kind="link" />
      </Section>

      <Section title="Modal (제목을 채우면 저장 버튼이 활성화됨)">
        <Button
          onClick={() => {
            setModalTitle('')
            setModalOpen(true)
          }}
        >
          모달 열기
        </Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="자료 추가"
          footer={
            <Button
              fullWidth
              variant="solid"
              disabled={!modalTitle.trim()}
              onClick={() => setModalOpen(false)}
            >
              저장
            </Button>
          }
        >
          <Input
            label="제목"
            placeholder="제목을 입력하세요"
            value={modalTitle}
            onChange={(e) => setModalTitle(e.target.value)}
          />
          <Textarea label="메모" placeholder="메모를 입력하세요" />
        </Modal>
      </Section>

      <Section title="Toast">
        <Button onClick={() => toast('관리자 권한이 위임되었습니다.')}>토스트 띄우기</Button>
      </Section>

      <Section title="ConfirmDialog">
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          삭제 확인 열기
        </Button>
        <ConfirmDialog
          open={confirmOpen}
          title="프로젝트를 삭제하시겠습니까?"
          description="삭제한 프로젝트는 다시 되돌릴 수 없습니다."
          confirmLabel="삭제"
          cancelLabel="취소"
          tone="danger"
          onConfirm={() => setConfirmOpen(false)}
          onCancel={() => setConfirmOpen(false)}
        />
      </Section>
    </div>
  )
}
