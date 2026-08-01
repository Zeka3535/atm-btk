import { Modal } from './UiKit'
import { IconGoogleMaps, IconYandexMaps } from './icons'
import { googleMapsUrl, yandexMapsUrl } from '../types'

interface Props {
  address: string | null
  onClose: () => void
}

/** Выбор карт — Stitch ModalMaps, приоритет Яндекс */
export function MapsModal({ address, onClose }: Props) {
  if (!address) return null

  function open(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <Modal open onClose={onClose} title="Открыть в картах" showClose={false}>
      <p className="maps-addr muted">{address}</p>
      <div className="maps-stitch">
        <button
          type="button"
          className="maps-stitch-btn yandex"
          onClick={() => open(yandexMapsUrl(address))}
        >
          <IconYandexMaps size={22} />
          Яндекс.Карты
        </button>
        <button
          type="button"
          className="maps-stitch-btn google"
          onClick={() => open(googleMapsUrl(address))}
        >
          <IconGoogleMaps size={22} />
          Google Maps
        </button>
      </div>
      <button type="button" className="btn btn-ghost btn-block maps-cancel" onClick={onClose}>
        Отмена
      </button>
    </Modal>
  )
}
