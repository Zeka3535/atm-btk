import { useEffect, useRef, useState } from 'react'
import { useDemo } from '../context/DemoContext'
import { fileToReportDataUrl, MAX_REPORT_PHOTOS } from '../lib/reportPhoto'
import { BtkSelect } from './BtkSelect'
import { IconCamera, IconClose, IconGallery } from './icons'
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
const MAX = 500

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
  const [photos, setPhotos] = useState<string[]>([])
  const [zone, setZone] = useState(ZONES[0])
  /** Метка только по состоянию на момент открытия диалога */
  const [showDraftMark, setShowDraftMark] = useState(false)
  const [busyPhoto, setBusyPhoto] = useState(false)
  const galleryRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!taskId) return
    const t = getTask(taskId)
    if (!t) return

    const server = (t.reportText || '').trim()
    const draft = (t.reportDraft || '').trim()
    const sentPhotos = t.reportPhotos || []
    const draftPhotos = t.reportDraftPhotos || []

    if (server) {
      /* Есть серверный отчёт — черновик не используем */
      if (draft || draftPhotos.length) {
        updateTask(t.id, { reportDraft: '', reportDraftPhotos: [] })
      }
      setText(t.reportText || '')
      setPhotos(sentPhotos.slice(0, MAX_REPORT_PHOTOS))
      setShowDraftMark(false)
    } else if (draft || draftPhotos.length) {
      setText(t.reportDraft || '')
      setPhotos(draftPhotos.slice(0, MAX_REPORT_PHOTOS))
      setShowDraftMark(true)
    } else {
      setText('')
      setPhotos([])
      setShowDraftMark(false)
    }
    setZone(ZONES[0])
    // только при открытии / смене заявки
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId])

  if (!taskId || !task) return null

  function persistDraft(nextText: string, nextPhotos: string[]) {
    const trimmed = nextText.trim()
    const server = (task!.reportText || '').trim()
    const sameText = !trimmed || trimmed === server
    if (sameText && nextPhotos.length === 0) {
      updateTask(task!.id, { reportDraft: '', reportDraftPhotos: [] })
    } else {
      updateTask(task!.id, {
        reportDraft: sameText ? '' : nextText,
        reportDraftPhotos: nextPhotos,
      })
    }
  }

  function saveDraft(v: string) {
    setText(v)
    persistDraft(v, photos)
  }

  function savePhotos(next: string[]) {
    const capped = next.slice(0, MAX_REPORT_PHOTOS)
    setPhotos(capped)
    persistDraft(text, capped)
  }

  function closeWithoutSend() {
    persistDraft(text, photos)
    onClose()
  }

  function onSend() {
    const res = sendReport(task!.id, text, photos)
    if (!res.ok) {
      showToast(res.error || 'Ошибка')
      return
    }
    onClose()
  }

  async function onPickFiles(list: FileList | null) {
    if (!list?.length) return
    const room = MAX_REPORT_PHOTOS - photos.length
    if (room <= 0) {
      showToast('Можно прикрепить не больше 3 фото')
      return
    }
    const files = Array.from(list).slice(0, room)
    setBusyPhoto(true)
    try {
      const added: string[] = []
      for (const file of files) {
        try {
          added.push(await fileToReportDataUrl(file))
        } catch {
          showToast('Не удалось загрузить фото')
        }
      }
      if (added.length) savePhotos([...photos, ...added])
    } finally {
      setBusyPhoto(false)
      if (galleryRef.current) galleryRef.current.value = ''
      if (cameraRef.current) cameraRef.current.value = ''
    }
  }

  function removePhoto(index: number) {
    savePhotos(photos.filter((_, i) => i !== index))
  }

  const title = (
    <>
      Текст отчёта
      {showDraftMark && <span className="draft-mark"> (черновик)</span>}
    </>
  )

  const canAdd = photos.length < MAX_REPORT_PHOTOS && !busyPhoto

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
      <div className="report-photos-block">
        <div className="report-photos-head">
          <span className="report-photos-label">Фото к отчёту</span>
          <span className="muted">
            {photos.length}/{MAX_REPORT_PHOTOS}
          </span>
        </div>
        <div className="report-photos-grid">
          {photos.map((src, i) => (
            <div key={`${i}-${src.slice(0, 24)}`} className="report-photo-tile">
              <img src={src} alt="" className="report-photo-img" />
              <button
                type="button"
                className="report-photo-remove"
                aria-label="Убрать фото"
                onClick={() => removePhoto(i)}
              >
                <IconClose size={14} />
              </button>
            </div>
          ))}
          {canAdd && (
            <>
              <button
                type="button"
                className="report-photo-add"
                onClick={() => galleryRef.current?.click()}
              >
                <IconGallery size={22} />
                <span>Галерея</span>
              </button>
              <button
                type="button"
                className="report-photo-add"
                onClick={() => cameraRef.current?.click()}
              >
                <IconCamera size={22} />
                <span>Снять</span>
              </button>
            </>
          )}
        </div>
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          className="visually-hidden"
          tabIndex={-1}
          onChange={(e) => void onPickFiles(e.target.files)}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="visually-hidden"
          tabIndex={-1}
          onChange={(e) => void onPickFiles(e.target.files)}
        />
      </div>
      <div className="report-meta">
        <button
          type="button"
          className="btn-ghost-sm"
          onClick={() => {
            setText('')
            setPhotos([])
            persistDraft('', [])
          }}
        >
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
          Отправить
        </button>
      </div>
    </Modal>
  )
}
