import { useEffect, useId, useRef, useState } from 'react'

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`btk-select-chevron${open ? ' open' : ''}`}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M7.41,8.59L12,13.17l4.59,-4.58L18,10l-6,6 -6,-6 1.41,-1.41z"
      />
    </svg>
  )
}

export function BtkSelect({
  id,
  label,
  value,
  options,
  onChange,
  menuPlacement = 'down',
}: {
  id?: string
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
  /** down — вниз (по умолчанию); up — вверх (поля у нижнего края модалки) */
  menuPlacement?: 'down' | 'up'
}) {
  const genId = useId()
  const selectId = id ?? genId
  const listId = `${selectId}-list`
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="field btk-select-field" ref={rootRef}>
      <label id={`${selectId}-label`} htmlFor={selectId}>
        {label}
      </label>
      <div className="btk-select-wrap">
        <button
          type="button"
          id={selectId}
          className={`btk-select-trigger${open ? ' open' : ''}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${selectId}-label`}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="btk-select-value">{value}</span>
          <Chevron open={open} />
        </button>
        {open && (
          <ul
            id={listId}
            className={`btk-select-menu${menuPlacement === 'up' ? ' up' : ''}`}
            role="listbox"
            aria-labelledby={`${selectId}-label`}
          >
            {options.map((opt) => {
              const selected = opt === value
              return (
                <li key={opt} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`btk-select-option${selected ? ' selected' : ''}`}
                    onClick={() => {
                      onChange(opt)
                      setOpen(false)
                    }}
                  >
                    <span>{opt}</span>
                    {selected && (
                      <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden>
                        <path
                          fill="currentColor"
                          d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41,-1.41L9,16.17z"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
