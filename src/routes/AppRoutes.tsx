import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ProjectLayout } from '@/layouts/ProjectLayout'
import { UiKitPage } from '@/dev/UiKitPage'
import { InviteExpiredPage } from '@/pages/InviteExpiredPage'
import { InvitePage } from '@/pages/InvitePage'
import { LoginPage } from '@/pages/LoginPage'
import { MyPage } from '@/pages/MyPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ChecklistPage } from '@/pages/project/ChecklistPage'
import { MaterialsPage } from '@/pages/project/MaterialsPage'
import { MinuteEditorPage } from '@/pages/project/MinuteEditorPage'
import { MinutesListPage } from '@/pages/project/MinutesListPage'
import { ProjectDashboardPage } from '@/pages/project/ProjectDashboardPage'
import { SettingsPage } from '@/pages/project/SettingsPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { RedirectIfAuthed } from '@/routes/RedirectIfAuthed'
import { RequireAuth } from '@/routes/RequireAuth'
import { SignupPage } from '@/pages/SignupPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        {/* 랜딩페이지는 아직 기획 전이라 "/"는 임시로 로그인 화면으로 보낸다 */}
        <Route element={<RedirectIfAuthed />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* 초대링크는 로그인 여부와 무관하게 접근 가능해야 하므로 RedirectIfAuthed 밖에 둔다 */}
        <Route path="/invite/expired" element={<InviteExpiredPage />} />
        <Route path="/invite/:token" element={<InvitePage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/my-page" element={<MyPage />} />
        </Route>

        <Route path="/projects/:projectId" element={<ProjectLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ProjectDashboardPage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="minutes" element={<MinutesListPage />} />
          <Route path="minutes/new" element={<MinuteEditorPage />} />
          <Route path="minutes/:minuteId" element={<MinuteEditorPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/dev/ui-kit" element={<UiKitPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
