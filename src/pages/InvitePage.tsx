import { useParams } from 'react-router-dom'

import { PageStub } from '@/components/PageStub'

export function InvitePage() {
  const { token } = useParams<{ token: string }>()

  return <PageStub title="초대 처리" description={`토큰: ${token}`} />
}
