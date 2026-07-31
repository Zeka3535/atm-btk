import type { ToastPayload } from '../context/DemoContext'

export function BtkToast({ toast }: { toast: ToastPayload }) {
  const text = toast.message ? `${toast.title}. ${toast.message}` : toast.title
  return (
    <div className="btk-snack" role="status" aria-live="polite">
      {text}
    </div>
  )
}
