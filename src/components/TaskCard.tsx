import { useNavigate } from 'react-router-dom'
import type { CallContact, DemoTask } from '../types'
import { isReportSentToday } from '../data/mockTasks'
import { IconNote } from './icons'
import { LinkedText } from './UiKit'
import { TaskFooter } from './TaskFooter'

interface Props {
  task: DemoTask
  onReport: (id: string) => void
  onContacts: (contacts: CallContact[]) => void
  onMaps: (address: string) => void
  /** На деталке — кнопка Wi‑Fi открывает модалку */
  onWifi?: () => void
  /** Не уходить со страницы при тапе по полям (уже открыта заявка) */
  embedded?: boolean
}

export function TaskCard({
  task,
  onReport,
  onContacts,
  onMaps,
  onWifi,
  embedded = false,
}: Props) {
  const navigate = useNavigate()
  const done = task.isClosed || isReportSentToday(task) || task.isOtpisano

  function open() {
    if (embedded) return
    navigate(`/tasks/${task.id}`)
  }

  return (
    <article className="card task-card stitch-card">
      <div className="task-header">
        <button
          type="button"
          className={`linkish task-address${done ? ' done' : ''}`}
          onClick={open}
        >
          {task.address}
        </button>
        <div className="task-header-meta">
          <span className="task-date">{task.dateLabel}</span>
          <span className="badge badge-period">{task.periodLabel}</span>
        </div>
      </div>
      <div className="task-divider" />

      <button type="button" className="linkish fio" onClick={open}>
        {task.subscriber}
      </button>

      {task.damage && (
        <button type="button" className="linkish damage damage-row" onClick={open}>
          <IconNote size={14} />
          <span>{task.damage}</span>
        </button>
      )}

      <button type="button" className="linkish task-text" onClick={open}>
        <LinkedText text={task.text} />
      </button>

      <TaskFooter
        task={task}
        onMaps={() => onMaps(task.address)}
        onContacts={onContacts}
        onWifi={onWifi}
        onReport={() => onReport(task.id)}
      />
    </article>
  )
}
