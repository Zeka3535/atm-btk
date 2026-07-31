import { Modal } from './UiKit'
import { IconPlace } from './icons'
import { googleMapsUrl, yandexMapsUrl } from '../types'

interface Props {
  address: string | null
  onClose: () => void
}

/** Выбор карт — приоритет Яндекс, как BtkMapIntents */
export function MapsModal({ address, onClose }: Props) {
  if (!address) return null

  function open(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <Modal open onClose={onClose} title="Открыть в картах">
      <p className="muted maps-addr">{address}</p>
      <ul className="maps-list">
        <li>
          <button type="button" className="maps-option" onClick={() => open(yandexMapsUrl(address))}>
            <IconPlace size={22} />
            <span>
              <strong>Яндекс.Карты</strong>
              <span className="muted">Рекомендуется</span>
            </span>
          </button>
        </li>
        <li>
          <button type="button" className="maps-option" onClick={() => open(googleMapsUrl(address))}>
            <IconPlace size={22} />
            <span>
              <strong>Google Maps</strong>
              <span className="muted">Запасной вариант</span>
            </span>
          </button>
        </li>
      </ul>
      <div className="modal-actions">
        <button type="button" className="btn btn-ghost btn-block" onClick={onClose}>
          Отмена
        </button>
      </div>
    </Modal>
  )
}
