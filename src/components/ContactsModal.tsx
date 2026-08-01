import type { CallContact } from '../types'
import { cityTelHref, formatCityPhone, formatPhoneDisplay, telHref } from '../types'
import { IconPhone, IconSmartphone } from './icons'
import { Modal } from './UiKit'

interface Props {
  contacts: CallContact[] | null
  onClose: () => void
}

/** Модалка вызова — Stitch ModalContacts */
export function ContactsModal({ contacts, onClose }: Props) {
  if (!contacts || contacts.length === 0) return null

  return (
    <Modal open onClose={onClose} title="Хотите связаться с абонентом?" showClose={false}>
      <ul className="contacts-stitch">
        {contacts.map((c) => {
          const href = c.kind === 'city' ? cityTelHref(c.phone) : telHref(c.phone)
          const label = c.kind === 'city' ? formatCityPhone(c.phone) : formatPhoneDisplay(c.phone)
          const kind = c.kind === 'city' ? 'Городской' : 'Мобильный'
          return (
            <li key={`${c.kind}-${c.phone}`} className={`contact-stitch-card ${c.kind}`}>
              <div className="contact-stitch-left">
                <span className="contact-stitch-ico" aria-hidden>
                  {c.kind === 'city' ? <IconPhone size={22} /> : <IconSmartphone size={22} />}
                </span>
                <div>
                  <p className="contact-stitch-kind">{kind}</p>
                  <p className="contact-stitch-num">{label}</p>
                </div>
              </div>
              <a className="contact-stitch-call" href={href} onClick={onClose}>
                <IconPhone size={18} />
                Вызов
              </a>
            </li>
          )
        })}
      </ul>
      <button type="button" className="btn btn-ghost btn-block" onClick={onClose}>
        Отмена
      </button>
    </Modal>
  )
}
