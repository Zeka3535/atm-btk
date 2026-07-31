import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { BtkToast } from './components/BtkToast'
import { BottomNav } from './components/NavChrome'
import { DemoProvider, useDemo } from './context/DemoContext'
import { ClosedPage } from './pages/ClosedPage'
import { LoginPage } from './pages/LoginPage'
import { SettingsPage } from './pages/SettingsPage'
import { TaskDetailPage } from './pages/TaskDetailPage'
import { TasksPage } from './pages/TasksPage'

function RequireAuth() {
  const { loggedIn, toast } = useDemo()
  if (!loggedIn) return <Navigate to="/login" replace />
  return (
    <div className="app-shell">
      <Outlet />
      <BottomNav />
      {toast && <BtkToast toast={toast} />}
    </div>
  )
}

export default function App() {
  return (
    <DemoProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
            <Route path="/closed" element={<ClosedPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </HashRouter>
    </DemoProvider>
  )
}
