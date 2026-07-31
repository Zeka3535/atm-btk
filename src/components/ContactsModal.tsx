import type { CallContact } from '../types'
import { cityTelHref, formatCityPhone, formatPhoneDisplay, telHref } from '../types'
import { Modal } from './UiKit'

function PhoneGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62,10.79c1.44,2.83 3.76,5.14 6.59,6.59l2.2,-2.2c0.27,-0.27 0.67,-0.36 1.02,-0.24 1.12,0.37 2.33,0.57 3.57,0.57 0.55,0 1,0.45 1,1V20c0,0.55 -0.45,1 -1,1 -9.39,0 -17,-7.61 -17,-17 0,-0.55 0.45,-1 1,-1h3.5c0.55,0 1,0.45 1,1 0,1.25 0.2,2.45 0.57,3.57 0.11,0.35 0.03,0.74 -0.25,1.02l-2.2,2.2z" />
    </svg>
  )
}

interface Props {
  contacts: CallContact[] | null
  onClose: () => void
}

/** Модалка вызова — как SimpleDialog в ATM («Хотите связаться…») */
export function ContactsModal({ contacts, onClose }: Props) {
  if (!contacts || contacts.length === 0) return null

  return (
    <Modal open onClose={onClose} title="Хотите связаться с абонентом?">
      <ul className="contacts-list">
        {contacts.map((c) => {
          const href = c.kind === 'city' ? cityTelHref(c.phone) : telHref(c.phone)
          const label = c.kind === 'city' ? formatCityPhone(c.phone) : formatPhoneDisplay(c.phone)
          return (
            <li key={`${c.kind}-${c.phone}`}>
              <a className="contact-call-row" href={href} onClick={onClose}>
                <span className="contact-call-ico">
                  <PhoneGlyph />
                </span>
                <span className="contact-call-text">
                  <span className="contact-call-num">{label}</span>
                  {c.kind === 'city' && <span className="contact-call-kind">Городской</span>}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
      <div className="modal-actions">
        <button type="button" className="btn btn-ghost btn-block" onClick={onClose}>
          Отмена
        </button>
      </div>
    </Modal>
  )
}
