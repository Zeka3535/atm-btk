import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

const THRESHOLD = 68
const MAX_PULL = 112

function scrollTop() {
  return window.scrollY || document.documentElement.scrollTop || 0
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
  const pulling = useRef(false)
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

  const beginPull = (clientY: number) => {
    if (disabled || refreshingRef.current) return
    if (scrollTop() > 1) return
    startY.current = clientY
    pulling.current = true
  }

  const movePull = (clientY: number, e?: Event) => {
    if (!pulling.current || disabled || refreshingRef.current) return
    if (scrollTop() > 1 && pullRef.current === 0) {
      pulling.current = false
      return
    }
    const dy = clientY - startY.current
    if (dy <= 0) {
      if (pullRef.current !== 0) setPull(0)
      return
    }
    const next = Math.min(MAX_PULL, dy * 0.42)
    setPull(next)
    if (next > 8 && e) e.preventDefault()
  }

  const endPull = () => {
    if (!pulling.current) return
    pulling.current = false
    if (refreshingRef.current) return
    if (pullRef.current >= THRESHOLD) {
      void runRefresh()
    } else {
      setPull(0)
    }
  }

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => beginPull(e.touches[0].clientY)
    const onTouchMove = (e: TouchEvent) => movePull(e.touches[0].clientY, e)
    const onTouchEnd = () => endPull()

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      if (e.button !== 0) return
      beginPull(e.clientY)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      if (!pulling.current) return
      movePull(e.clientY)
    }
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      endPull()
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
    // begin/move/end замыкают актуальные refs
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
