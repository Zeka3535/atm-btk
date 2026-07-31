import { useNavigate } from 'react-router-dom'
import type { CallContact, DemoTask } from '../types'
import { isReportSentToday } from '../data/mockTasks'
import { LinkedText } from './UiKit'
import { TaskFooter } from './TaskFooter'

interface Props {
  task: DemoTask
  onReport: (id: string) => void
  onContacts: (contacts: CallContact[]) => void
  onMaps: (address: string) => void
}

export function TaskCard({ task, onReport, onContacts, onMaps }: Props) {
  const navigate = useNavigate()
  const done = task.isClosed || isReportSentToday(task)

  function open() {
    navigate(`/tasks/${task.id}`)
  }

  return (
    <article className="card task-card">
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
        <button type="button" className="linkish damage" onClick={open}>
          {task.damage}
        </button>
      )}
      <button type="button" className="linkish task-text" onClick={open}>
        <LinkedText text={task.text} />
      </button>

      <TaskFooter
        task={task}
        onMaps={() => onMaps(task.address)}
        onContacts={onContacts}
        onReport={() => onReport(task.id)}
      />
    </article>
  )
}
