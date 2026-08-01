import { type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { formatPhoneDisplay, linkifyPhones, telHref } from '../types'
import { useDevicePortalRoot } from './DeviceFrame'

/** Текст с tel:-ссылками (вызов на смартфоне) */
export function LinkedText({ text, className }: { text: string; className?: string }) {
  const parts = linkifyPhones(text)
  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.type === 'tel' ? (
          <a
            key={i}
            className="tel-link"
            href={telHref(p.value)}
            onClick={(e) => e.stopPropagation()}
          >
            {formatPhoneDisplay(p.value)}
          </a>
        ) : (
          <span key={i}>{p.value}</span>
        ),
      )}
    </span>
  )
}

const CLOSE_DY = 110
const CLOSE_VY = 0.65

export function Modal({
  open,
  onClose,
  children,
  title,
  subtitle,
  variant = 'sheet',
  showClose = false,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: ReactNode
  subtitle?: string
  /** sheet — снизу (отчёт/карты); center — по центру (Wi‑Fi, контакты) */
  variant?: 'sheet' | 'center'
  /** Крестик в шапке; по умолчанию выкл. — закрытие через «Отмена» / жест */
  showClose?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const drag = useRef({
    active: false,
    pointerId: -1,
    startY: 0,
    lastY: 0,
    lastT: 0,
    dy: 0,
    vy: 0,
  })

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const card = cardRef.current
    if (card) {
      card.style.transform = ''
      card.style.transition = ''
      card.classList.remove('is-dragging')
    }
  }, [open])

  function setDragVisual(dy: number) {
    const card = cardRef.current
    if (!card) return
    card.style.transform = `translateY(${dy}px)`
  }

  function endDrag(dismiss: boolean) {
    const card = cardRef.current
    drag.current.active = false
    drag.current.pointerId = -1
    if (!card) return
    card.classList.remove('is-dragging')
    if (dismiss) {
      card.style.transition = 'transform 0.22s ease-in'
      card.style.transform = `translateY(${Math.max(window.innerHeight * 0.55, drag.current.dy + 180)}px)`
      window.setTimeout(() => onClose(), 200)
      return
    }
    card.style.transition = 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)'
    card.style.transform = 'translateY(0)'
  }

  function onDragPointerDown(e: ReactPointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const t = e.target as HTMLElement | null
    if (t?.closest('button, a, input, textarea, select, label')) return
    const d = drag.current
    d.active = true
    d.pointerId = e.pointerId
    d.startY = e.clientY
    d.lastY = e.clientY
    d.lastT = performance.now()
    d.dy = 0
    d.vy = 0
    const card = cardRef.current
    if (card) {
      card.classList.add('is-dragging')
      card.style.transition = 'none'
      card.style.animation = 'none'
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onDragPointerMove(e: ReactPointerEvent) {
    const d = drag.current
    if (!d.active || e.pointerId !== d.pointerId) return
    const now = performance.now()
    const y = e.clientY
    const dt = Math.max(1, now - d.lastT)
    d.vy = (y - d.lastY) / dt
    d.lastY = y
    d.lastT = now
    d.dy = Math.max(0, y - d.startY)
    setDragVisual(d.dy)
  }

  function onDragPointerUp(e: ReactPointerEvent) {
    const d = drag.current
    if (!d.active || e.pointerId !== d.pointerId) return
    const dismiss = d.dy >= CLOSE_DY || d.vy > CLOSE_VY
    endDrag(dismiss)
  }

  const portalRoot = useDevicePortalRoot()

  if (!open) return null

  const dragHandlers = {
    onPointerDown: onDragPointerDown,
    onPointerMove: onDragPointerMove,
    onPointerUp: onDragPointerUp,
    onPointerCancel: onDragPointerUp,
  }

  return createPortal(
    <div
      className={`modal-backdrop${variant === 'center' ? ' modal-center' : ''}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={cardRef}
        className={`modal-card${variant === 'center' ? ' modal-card-center' : ''}`}
        role="dialog"
        aria-modal
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-handle-hit" {...dragHandlers}>
          <div className="modal-handle" aria-hidden />
        </div>
        {(title || subtitle) && (
          <header className="modal-head" {...dragHandlers}>
            <div className="modal-head-text">
              {title && <h2 className="modal-title">{title}</h2>}
              {subtitle && <p className="modal-sub">{subtitle}</p>}
            </div>
            {showClose && (
              <button type="button" className="modal-close" onClick={onClose} aria-label="Закрыть">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M19,6.41L17.59,5 12,10.59 6.41,5 5,6.41 10.59,12 5,17.59 6.41,19 12,13.41 17.59,19 19,17.59 13.41,12z" />
                </svg>
              </button>
            )}
          </header>
        )}
        {children}
      </div>
    </div>,
    portalRoot ?? document.body,
  )
}

export function Loader() {
  return (
    <div className="loader-wrap" aria-busy>
      <div className="loader-circle" />
    </div>
  )
}
