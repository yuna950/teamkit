import { useParams } from 'react-router-dom'

import { PageStub } from '@/components/PageStub'

export function MinuteEditorPage() {
  const { minuteId } = useParams<{ minuteId: string }>()

  return (
    <PageStub
      title="회의록 작성/수정"
      description={minuteId ? `수정 대상: ${minuteId}` : '새 회의록 작성'}
    />
  )
}
