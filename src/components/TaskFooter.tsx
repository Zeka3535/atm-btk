import type { MouseEvent, ReactNode } from 'react'
import type { CallContact, DemoTask, ServiceKind } from '../types'
import { SERVICE_LABEL, formatPhoneDisplay, taskCallContacts } from '../types'
import { isReportSentToday } from '../data/mockTasks'
import {
  IconPay,
  IconPlace,
  IconReceipt,
  IconTv,
  IconVip,
  IconWifi,
} from './icons'

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62,10.79c1.44,2.83 3.76,5.14 6.59,6.59l2.2,-2.2c0.27,-0.27 0.67,-0.36 1.02,-0.24 1.12,0.37 2.33,0.57 3.57,0.57 0.55,0 1,0.45 1,1V20c0,0.55 -0.45,1 -1,1 -9.39,0 -17,-7.61 -17,-17 0,-0.55 0.45,-1 1,-1h3.5c0.55,0 1,0.45 1,1 0,1.25 0.2,2.45 0.57,3.57 0.11,0.35 0.03,0.74 -0.25,1.02l-2.2,2.2z" />
    </svg>
  )
}

const SVC_ICON: Record<ServiceKind, (p: { size?: number }) => ReactNode> = {
  pay: (p) => <IconPay {...p} />,
  tv: (p) => <IconTv {...p} />,
  wifi: (p) => <IconWifi {...p} />,
  vip: (p) => <IconVip {...p} />,
}

function ServiceChip({ kind }: { kind: ServiceKind }) {
  return (
    <span className={`svc-chip svc-${kind}`}>
      <span className="svc-chip-ico">{SVC_ICON[kind]({ size: 15 })}</span>
      <span className="svc-chip-label">{SERVICE_LABEL[kind]}</span>
    </span>
  )
}

interface Props {
  task: DemoTask
  onMaps: () => void
  onContacts: (contacts: CallContact[]) => void
  onReport: () => void
}

/** Нижняя полоса карточки — как bottomContainer в ATM */
export function TaskFooter({ task, onMaps, onContacts, onReport }: Props) {
  const sentToday = isReportSentToday(task)
  const contacts = taskCallContacts(task)
  const phoneList = task.phones
  const phoneLabel = phoneList[0]
    ? formatPhoneDisplay(phoneList[0])
    : contacts[0]?.kind === 'city'
      ? 'Городской'
      : 'Номер не указан'

  function onPhoneClick(e: MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (contacts.length === 0) return
    /* Всегда модалка: сотовые + городской (если есть) */
    onContacts(contacts)
  }

  function onReportClick(e: MouseEvent) {
    e.stopPropagation()
    onReport()
  }

  return (
    <div className="task-footer">
      <button
        type="button"
        className="icon-btn map-hit"
        aria-label="Открыть в картах"
        onClick={(e) => {
          e.stopPropagation()
          onMaps()
        }}
      >
        <IconPlace size={20} />
      </button>

      {contacts.length > 0 ? (
        <button
          type="button"
          className="phone-zone"
          onClick={onPhoneClick}
          aria-label="Связаться с абонентом"
        >
          <span className="phone-ico">
            <PhoneIcon />
          </span>
          <span className="phone-num">{phoneLabel}</span>
        </button>
      ) : (
        <span className="phone-zone disabled">
          <span className="phone-ico">
            <PhoneIcon />
          </span>
          <span className="phone-num">{phoneLabel}</span>
        </span>
      )}

      <div className="task-footer-end">
        {task.services.map((s) => (
          <ServiceChip key={s} kind={s} />
        ))}

        {task.isClosed && <span className="closed-pin">Закрыта</span>}

        {!task.isClosed && sentToday && (
          <button type="button" className="report-pin sent" onClick={onReportClick}>
            <IconReceipt size={16} />
            Отчёт послан
          </button>
        )}
        {!task.isClosed && !sentToday && task.isOtpisano && (
          <button type="button" className="report-pin otpisano" onClick={onReportClick}>
            <IconReceipt size={16} />
            Отписано
          </button>
        )}
        {!task.isClosed && !sentToday && !task.isOtpisano && task.isNew && (
          <span className="report-pin new">Новая</span>
        )}
        {!task.isClosed && !sentToday && !task.isOtpisano && !task.isNew && (
          <button type="button" className="report-pin" onClick={onReportClick}>
            <IconReceipt size={15} />
            Отчёт
          </button>
        )}
      </div>
    </div>
  )
}
