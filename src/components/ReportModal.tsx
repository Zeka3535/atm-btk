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

/**
 * Черновик как BtkReportDraft в APK:
 * метка «(черновик)» — только если при открытии уже был сохранённый черновик
 * (пользователь раньше вышел без отправки); при серверном тексте черновик сбрасывается.
 */
export function ReportModal({ taskId, onClose }: Props) {
  const { getTask, updateTask, sendReport, showToast } = useDemo()
  const task = taskId ? getTask(taskId) : undefined
  const [text, setText] = useState('')
  const [zone, setZone] = useState(ZONES[0])
  /** Метка только по состоянию на момент открытия диалога */
  const [showDraftMark, setShowDraftMark] = useState(false)

  useEffect(() => {
    if (!taskId) return
    const t = getTask(taskId)
    if (!t) return

    const server = (t.reportText || '').trim()
    const draft = (t.reportDraft || '').trim()

    if (server) {
      /* Есть серверный отчёт — черновик не используем */
      if (draft) updateTask(t.id, { reportDraft: '' })
      setText(t.reportText || '')
      setShowDraftMark(false)
    } else if (draft) {
      setText(t.reportDraft)
      setShowDraftMark(true)
    } else {
      setText('')
      setShowDraftMark(false)
    }
    setZone(ZONES[0])
    // только при открытии / смене заявки
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId])

  if (!taskId || !task) return null

  function saveDraft(v: string) {
    setText(v)
    const trimmed = v.trim()
    const server = (task!.reportText || '').trim()
    if (!trimmed || trimmed === server) {
      updateTask(task!.id, { reportDraft: '' })
    } else {
      updateTask(task!.id, { reportDraft: v })
    }
  }

  function closeWithoutSend() {
    const trimmed = text.trim()
    const server = (task!.reportText || '').trim()
    if (!trimmed || trimmed === server) {
      updateTask(task!.id, { reportDraft: '' })
    } else {
      updateTask(task!.id, { reportDraft: text })
    }
    onClose()
  }

  function onSend() {
    const res = sendReport(task!.id, text)
    if (!res.ok) {
      showToast(res.error || 'Ошибка')
      return
    }
    onClose()
  }

  const title = (
    <>
      Текст отчёта
      {showDraftMark && <span className="draft-mark"> (черновик)</span>}
    </>
  )

  return (
    <Modal open onClose={closeWithoutSend} title={title} subtitle={task.address} showClose={false}>
      <BtkSelect id="zone" label="Зона аварии" value={zone} options={ZONES} onChange={setZone} />
      <div className="field">
        <label htmlFor="report-text">Описание работ</label>
        <textarea
          id="report-text"
          className="report-area"
          value={text}
          maxLength={MAX}
          rows={6}
          placeholder="Введите подробности выполнения заявки…"
          onChange={(e) => saveDraft(e.target.value)}
        />
      </div>
      <div className="report-meta">
        <button type="button" className="btn-ghost-sm" onClick={() => saveDraft('')}>
          Очистить
        </button>
        <span className="muted">
          {text.length}/{MAX}
        </span>
      </div>
      <div className="modal-actions stitch-actions">
        <button type="button" className="btn btn-outline" onClick={closeWithoutSend}>
          Отмена
        </button>
        <button type="button" className="btn btn-send" onClick={onSend}>
          Послать
        </button>
      </div>
    </Modal>
  )
}
