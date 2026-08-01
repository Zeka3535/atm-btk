import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IconBack, IconClosed, IconInbox, IconSettings } from './icons'
import { useDemo } from '../context/DemoContext'
import { closedTasks, sortIncoming } from '../data/mockTasks'

export function TasksToolbar({ mode }: { mode: 'inbox' | 'closed' }) {
  const { tasks } = useDemo()
  const incoming = sortIncoming(tasks).length
  const closed = closedTasks(tasks).length
  const title = mode === 'inbox' ? 'Входящие' : 'Закрытые'
  const subtitle =
    mode === 'inbox' ? `Заявок всего: ${incoming}` : `Закрытых заявок: ${closed}`

  return (
    <header className="toolbar">
      <div>
        <h1 className="toolbar-title">{title}</h1>
        <p className="toolbar-sub">{subtitle}</p>
      </div>
      <div className="toolbar-actions">
        <Link to="/settings" className="icon-tool" title="Настройки" aria-label="Настройки">
          <IconSettings size={28} />
        </Link>
      </div>
    </header>
  )
}

/** Фиолетовая панель со стрелкой «Назад» и заголовком */
export function BackToolbar({
  title,
  fallbackTo = '/tasks',
}: {
  title?: string
  fallbackTo?: string
}) {
  const navigate = useNavigate()

  function goBack() {
    if (window.history.length > 1) navigate(-1)
    else navigate(fallbackTo, { replace: true })
  }

  return (
    <header className="toolbar toolbar-back">
      <button type="button" className="toolbar-back-hit" onClick={goBack} aria-label="Назад">
        <span className="icon-tool" aria-hidden>
          <IconBack size={28} />
        </span>
        {title ? <span className="toolbar-title toolbar-back-title">{title}</span> : null}
      </button>
    </header>
  )
}

export function BottomNav() {
  const { tasks } = useDemo()
  const location = useLocation()
  const incoming = sortIncoming(tasks).length
  const closed = closedTasks(tasks).length
  const path = location.pathname
  if (path === '/settings') return null

  const onInbox = path === '/tasks' || path.startsWith('/tasks/')
  const onClosed = path === '/closed'

  return (
    <nav className="bottom-nav" aria-label="Навигация">
      <Link to="/tasks" className={`nav-item${onInbox ? ' active' : ''}`} aria-label="Входящие">
        <IconInbox size={24} />
        {!onInbox && incoming > 0 && <span className="nav-badge">{incoming}</span>}
      </Link>
      <Link to="/closed" className={`nav-item${onClosed ? ' active' : ''}`} aria-label="Закрытые">
        <IconClosed size={24} />
        {!onClosed && closed > 0 && <span className="nav-badge">{closed}</span>}
      </Link>
    </nav>
  )
}
