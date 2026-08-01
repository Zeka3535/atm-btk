import type { LanDevice } from '../types'
import { IconSmartphone, IconWifi } from './icons'
import { Modal } from './UiKit'

interface Props {
  devices: LanDevice[] | null
  onClose: () => void
}

/** Список устройств LAN модема */
export function LanDevicesModal({ devices, onClose }: Props) {
  if (devices == null) return null

  return (
    <Modal open onClose={onClose} title="Устройства в сети" showClose={false}>
      {devices.length === 0 ? (
        <p className="muted lan-empty">Нет подключённых устройств</p>
      ) : (
        <ul className="lan-device-list">
          {devices.map((d) => (
            <li key={d.mac} className={`lan-device-card${d.online === false ? ' off' : ''}`}>
              <span className="lan-device-ico" aria-hidden>
                {/tv|zala|smart/i.test(d.name) ? <IconWifi size={20} /> : <IconSmartphone size={20} />}
              </span>
              <div className="lan-device-body">
                <strong>{d.name}</strong>
                <span className="lan-device-mac mono">{d.mac}</span>
                {d.ip && <span className="lan-device-ip">{d.ip}</span>}
              </div>
              <span className={`lan-device-status${d.online === false ? ' off' : ' on'}`}>
                {d.online === false ? 'Офлайн' : 'В сети'}
              </span>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="btn btn-ghost btn-block" onClick={onClose}>
        Закрыть
      </button>
    </Modal>
  )
}
