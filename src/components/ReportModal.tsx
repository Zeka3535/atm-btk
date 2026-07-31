import { useEffect, useState } from 'react'
import { useDemo } from '../context/DemoContext'
import { BtkSelect } from './BtkSelect'
import { Modal } from './UiKit'

/** Как R.array.send_types в ATM (спиннер «Зона аварии») */
const ZONES = [
  'абонентский участок',
  'распределительный участок',
  'терминальное оборудование',
  'магистральный участок',
  'оконечное аб. устройство',
  'станционное оборудование с абонкомплектами',
  'Прочее',
]
const MAX = 506

interface Props {
  taskId: string | null
  onClose: () => void
}

export function ReportModal({ taskId, onClose }: Props) {
  const { getTask, updateTask, sendReport, showToast } = useDemo()
  const task = taskId ? getTask(taskId) : undefined
  const [text, setText] = useState('')
  const [zone, setZone] = useState(ZONES[0])

  useEffect(() => {
    if (!task) return
    setText(task.reportDraft || task.reportText || '')
    setZone(ZONES[0])
  }, [task])

  if (!taskId || !task) return null

  const isDraft = !!task.reportDraft && !task.isSended
  const title = isDraft ? 'Текст отчёта (черновик)' : 'Текст отчёта'

  function saveDraft(v: string) {
    setText(v)
    updateTask(task!.id, { reportDraft: v })
  }

  function onSend() {
    const res = sendReport(task!.id, text)
    if (!res.ok) {
      showToast(res.error || 'Ошибка')
      return
    }
    onClose()
  }

  return (
    <Modal open onClose={onClose} title={title}>
      <p className="muted" style={{ marginTop: 0 }}>
        {task.address}
      </p>
      {isDraft && <p className="draft-label">(черновик)</p>}
      <textarea
        className="report-area"
        value={text}
        maxLength={MAX}
        rows={6}
        placeholder="Текст отчёта"
        onChange={(e) => saveDraft(e.target.value)}
      />
      <BtkSelect
        id="zone"
        label="Зона аварии"
        value={zone}
        options={ZONES}
        onChange={setZone}
      />
      <div className="report-meta">
        <button type="button" className="btn-ghost-sm" onClick={() => saveDraft('')}>
          Очистить
        </button>
        <span className="muted">
          {text.length} / {MAX}
        </span>
      </div>
      <div className="modal-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Отмена
        </button>
        <button type="button" className="btn" onClick={onSend}>
          Послать
        </button>
      </div>
    </Modal>
  )
}
