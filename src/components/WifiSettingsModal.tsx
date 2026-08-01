import { useEffect, useState, type FormEvent } from 'react'
import { useDemo } from '../context/DemoContext'
import { IconEye, IconEyeOff } from './icons'
import { BtkSelect } from './BtkSelect'
import { Modal } from './UiKit'

const WIFI_BANDS = ['2.4 ГГц', '5 ГГц', '2.4 + 5 ГГц']

interface Props {
  taskId: string | null
  onClose: () => void
}

export function WifiSettingsModal({ taskId, onClose }: Props) {
  const { getTask, updateTask, showToast } = useDemo()
  const task = taskId ? getTask(taskId) : undefined
  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')
  const [band, setBand] = useState('2.4 ГГц')
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if (!task) return
    setSsid(task.wifi?.ssid ?? 'Beltelecom_Home')
    setPassword(task.wifi?.password ?? '')
    setBand(task.wifi?.band ?? '2.4 ГГц')
  }, [task])

  if (!taskId || !task) return null

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!ssid.trim()) {
      showToast('Укажите имя сети (SSID)')
      return
    }
    if (password.trim().length > 0 && password.trim().length < 8) {
      showToast('Пароль Wi‑Fi должен быть не короче 8 символов')
      return
    }
    updateTask(task!.id, {
      wifi: {
        ssid: ssid.trim(),
        password: password.trim(),
        band,
      },
    })
    showToast('Настройки Wi‑Fi сохранены (демо)')
    onClose()
  }

  return (
    <Modal open onClose={onClose} title="Настройка Wi‑Fi" showClose={false}>
      <form className="wifi-form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="wifi-ssid">SSID (Имя сети)</label>
          <input
            id="wifi-ssid"
            className="stitch-input"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            placeholder="Beltelecom_Home"
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor="wifi-pass">Пароль</label>
          <div className="field-control">
            <input
              id="wifi-pass"
              className="stitch-input"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="field-trail"
              aria-label={showPass ? 'Скрыть пароль' : 'Показать пароль'}
              onClick={() => setShowPass((v) => !v)}
            >
              {showPass ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
        </div>
        <BtkSelect
          id="wifi-band"
          label="Диапазон"
          value={band}
          options={WIFI_BANDS}
          onChange={setBand}
        />
        <div className="modal-actions stitch-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn-send">
            Применить
          </button>
        </div>
      </form>
    </Modal>
  )
}
