import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { formatPhoneDisplay, linkifyPhones, telHref } from '../types'

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

export function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-card"
        role="dialog"
        aria-modal
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="modal-title">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function Loader() {
  return (
    <div className="loader-wrap" aria-busy>
      <div className="loader-circle" />
    </div>
  )
}
