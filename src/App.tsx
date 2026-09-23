import { AuthProvider } from '@/auth/AuthContext'
import { ChecklistProvider } from '@/checklist/ChecklistContext'
import { ToastProvider } from '@/components/ui/Toast'
import { DevNav } from '@/dev/DevNav'
import { MaterialsProvider } from '@/materials/MaterialsContext'
import { ProjectsProvider } from '@/projects/ProjectsContext'
import { AppRoutes } from '@/routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <MaterialsProvider>
          <ChecklistProvider>
            <ToastProvider>
              <AppRoutes />
              <DevNav />
            </ToastProvider>
          </ChecklistProvider>
        </MaterialsProvider>
      </ProjectsProvider>
    </AuthProvider>
  )
}

export default App
