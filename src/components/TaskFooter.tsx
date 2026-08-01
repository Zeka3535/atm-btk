import type { MouseEvent, ReactNode } from 'react'
import type { CallContact, DemoTask, ServiceKind } from '../types'
import { SERVICE_LABEL, taskCallContacts } from '../types'
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
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

function ServiceChip({
  kind,
  onClick,
}: {
  kind: ServiceKind
  onClick?: () => void
}) {
  const className = `svc-chip svc-${kind}`
  const body = (
    <>
      <span className="svc-chip-ico">{SVC_ICON[kind]({ size: 14 })}</span>
      <span className="svc-chip-label">{SERVICE_LABEL[kind]}</span>
    </>
  )
  /* Одинаковый markup со списком; клик — через span, чтобы не ломать стили button */
  if (onClick) {
    return (
      <span
        className={`${className} svc-chip-btn`}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()
            onClick()
          }
        }}
      >
        {body}
      </span>
    )
  }
  return <span className={className}>{body}</span>
}

interface Props {
  task: DemoTask
  onMaps: () => void
  onContacts: (contacts: CallContact[]) => void
  onReport: () => void
  onWifi?: () => void
  variant?: 'list' | 'detail'
}

/** Нижняя полоса: карта/телефон слева, чипы + CTA справа (как atm-pwa) */
export function TaskFooter({
  task,
  onMaps,
  onContacts,
  onReport,
  onWifi,
  variant = 'list',
}: Props) {
  const sentToday = isReportSentToday(task)
  const contacts = taskCallContacts(task)

  function onPhoneClick(e: MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (contacts.length === 0) return
    onContacts(contacts)
  }

  function onReportClick(e: MouseEvent) {
    e.stopPropagation()
    onReport()
  }

  const serviceKinds: ServiceKind[] =
    variant === 'list'
      ? task.services
      : task.services.includes('wifi') || task.wifi
        ? (['wifi', ...task.services.filter((s) => s !== 'wifi')] as ServiceKind[])
        : task.services

  return (
    <div className={`task-footer stitch-footer${variant === 'detail' ? ' detail' : ''}`}>
      <div className="footer-actions">
        <button
          type="button"
          className="action-round"
          aria-label="Открыть в картах"
          onClick={(e) => {
            e.stopPropagation()
            onMaps()
          }}
        >
          <IconPlace size={18} />
        </button>

        {contacts.length > 0 ? (
          <button
            type="button"
            className="action-round"
            onClick={onPhoneClick}
            aria-label="Связаться с абонентом"
          >
            <PhoneIcon />
          </button>
        ) : (
          <span className="action-round disabled" aria-hidden>
            <PhoneIcon />
          </span>
        )}
      </div>

      <div className="footer-cta">
        {serviceKinds.map((s) => (
          <ServiceChip
            key={s}
            kind={s}
            onClick={s === 'wifi' && onWifi ? onWifi : undefined}
          />
        ))}

        {task.isClosed && <span className="cta-btn closed">Закрыта</span>}

        {!task.isClosed && sentToday && (
          <button type="button" className="cta-pin sent" onClick={onReportClick}>
            <IconReceipt size={16} />
            Отчёт послан
          </button>
        )}

        {!task.isClosed && !sentToday && task.isOtpisano && (
          <button type="button" className="cta-btn otpisano" onClick={onReportClick}>
            Отписано
          </button>
        )}

        {!task.isClosed && !sentToday && !task.isOtpisano && task.isNew && (
          <span className="cta-btn new">Новая</span>
        )}

        {!task.isClosed && !sentToday && !task.isOtpisano && !task.isNew && (
          <button type="button" className="cta-btn" onClick={onReportClick}>
            Отчёт
          </button>
        )}
      </div>
    </div>
  )
}
