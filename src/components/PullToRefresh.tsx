import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

const THRESHOLD = 68
const MAX_PULL = 112
/** Порог, после которого жест считается PTR, а не скроллом */
const ENGAGE = 12

function isScrollableY(el: HTMLElement): boolean {
  const oy = getComputedStyle(el).overflowY
  if (oy !== 'auto' && oy !== 'scroll' && oy !== 'overlay') return false
  return el.scrollHeight > el.clientHeight + 1
}

/** Актуальная позиция вертикального скролла (shell / документ) */
function getScrollTop(): number {
  const shell = document.querySelector('.app-shell') as HTMLElement | null
  if (shell && isScrollableY(shell)) return shell.scrollTop

  const se = document.scrollingElement as HTMLElement | null
  if (se) return se.scrollTop

  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
}

export function PullToRefresh({
  onRefresh,
  disabled,
  children,
}: {
  onRefresh: () => Promise<boolean | void>
  disabled?: boolean
  children: ReactNode
}) {
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const startX = useRef(0)
  const tracking = useRef(false)
  const engaged = useRef(false)
  const pullRef = useRef(0)
  const refreshingRef = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    pullRef.current = pull
  }, [pull])

  const runRefresh = useCallback(async () => {
    if (refreshingRef.current) return
    refreshingRef.current = true
    setRefreshing(true)
    setPull(THRESHOLD)
    try {
      await onRefresh()
    } finally {
      refreshingRef.current = false
      setRefreshing(false)
      setPull(0)
    }
  }, [onRefresh])

  const resetGesture = () => {
    tracking.current = false
    engaged.current = false
    if (pullRef.current !== 0 && !refreshingRef.current) setPull(0)
  }

  const beginTrack = (clientX: number, clientY: number) => {
    if (disabled || refreshingRef.current) return
    if (getScrollTop() > 1) return
    startX.current = clientX
    startY.current = clientY
    tracking.current = true
    engaged.current = false
  }

  const moveTrack = (clientX: number, clientY: number, e?: Event) => {
    if (!tracking.current || disabled || refreshingRef.current) return

    /* Ушли со верха списка — отдаём жест скроллу */
    if (getScrollTop() > 1) {
      resetGesture()
      return
    }

    const dx = clientX - startX.current
    const dy = clientY - startY.current

    if (!engaged.current) {
      if (dy <= 0) return
      /* Горизонталь / слабый жест — не перехватываем скролл */
      if (Math.abs(dx) > Math.abs(dy) || dy < ENGAGE) return
      engaged.current = true
    }

    if (dy <= 0) {
      resetGesture()
      return
    }

    const next = Math.min(MAX_PULL, (dy - ENGAGE) * 0.45 + ENGAGE * 0.2)
    setPull(next)
    /*
     * preventDefault только когда PTR уже «взял» жест.
     * Если системный refresh уже блокирован CSS — всё равно нужно,
     * чтобы страница не «съедала» тягу.
     */
    if (e && next > 4) e.preventDefault()
  }

  const endTrack = () => {
    if (!tracking.current) return
    const wasEngaged = engaged.current
    const dist = pullRef.current
    tracking.current = false
    engaged.current = false
    if (refreshingRef.current) return
    if (wasEngaged && dist >= THRESHOLD) {
      void runRefresh()
    } else {
      setPull(0)
    }
  }

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      beginTrack(t.clientX, t.clientY)
    }
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      moveTrack(t.clientX, t.clientY, e)
    }
    const onTouchEnd = () => endTrack()

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      if (e.button !== 0) return
      beginTrack(e.clientX, e.clientY)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      if (!tracking.current) return
      moveTrack(e.clientX, e.clientY)
    }
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      endTrack()
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)
    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, runRefresh])

  const show = refreshing || pull > 0
  const armed = pull >= THRESHOLD || refreshing
  const height = refreshing ? THRESHOLD : pull

  return (
    <div ref={rootRef} className="ptr-root">
      <div
        className={`ptr-indicator${show ? ' show' : ''}${armed ? ' armed' : ''}${refreshing ? ' spinning' : ''}`}
        style={{ height }}
        aria-hidden={!show}
      >
        <div className="ptr-spinner" />
      </div>
      <div
        className="ptr-content"
        style={{
          transform: pull && !refreshing ? `translateY(${Math.round(pull * 0.12)}px)` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  )
}
