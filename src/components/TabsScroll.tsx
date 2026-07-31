import { useEffect, useRef, type ReactNode } from 'react'

const DRAG_THRESHOLD = 6

function centerInScroller(scroller: HTMLElement, child: HTMLElement, smooth: boolean) {
  const target = child.offsetLeft - (scroller.clientWidth - child.offsetWidth) / 2
  const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth)
  const left = Math.max(0, Math.min(max, target))
  scroller.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' })
}

/** Горизонтальная лента вкладок: свайп, drag и центрирование активной */
export function TabsScroll({
  children,
  className = '',
  activeId,
}: {
  children: ReactNode
  className?: string
  /** Меняется при выборе вкладки — прокручивает активную к центру */
  activeId?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const firstCenter = useRef(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let armed = false
    let dragging = false
    let suppressClick = false
    let startX = 0
    let startScroll = 0
    let activePointerId: number | null = null

    const onPointerDown = (e: PointerEvent) => {
      /* Сенсор — нативный свайп; мышь/перо — drag только после сдвига */
      if (e.pointerType === 'touch') return
      if (e.pointerType === 'mouse' && e.button !== 0) return
      armed = true
      dragging = false
      suppressClick = false
      startX = e.clientX
      startScroll = el.scrollLeft
      activePointerId = e.pointerId
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!armed || e.pointerId !== activePointerId) return
      const dx = e.clientX - startX
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return
        dragging = true
        suppressClick = true
        el.classList.add('is-dragging')
        try {
          el.setPointerCapture(e.pointerId)
        } catch {
          /* ignore */
        }
      }
      el.scrollLeft = startScroll - dx
    }

    const endDrag = (e: PointerEvent) => {
      if (!armed || e.pointerId !== activePointerId) return
      armed = false
      activePointerId = null
      if (dragging) {
        dragging = false
        el.classList.remove('is-dragging')
        try {
          el.releasePointerCapture(e.pointerId)
        } catch {
          /* уже отпущено */
        }
      }
    }

    const onClickCapture = (e: MouseEvent) => {
      if (suppressClick) {
        e.preventDefault()
        e.stopPropagation()
        suppressClick = false
      }
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointercancel', endDrag)
    el.addEventListener('lostpointercapture', endDrag)
    el.addEventListener('click', onClickCapture, true)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endDrag)
      el.removeEventListener('pointercancel', endDrag)
      el.removeEventListener('lostpointercapture', endDrag)
      el.removeEventListener('click', onClickCapture, true)
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || activeId == null) return
    const active = el.querySelector('.tab.on')
    if (!(active instanceof HTMLElement)) return
    const smooth = !firstCenter.current
    firstCenter.current = false
    /* После покраски активной кнопки */
    requestAnimationFrame(() => centerInScroller(el, active, smooth))
  }, [activeId])

  return (
    <div ref={ref} className={`tabs tabs-scroll ${className}`.trim()}>
      {children}
    </div>
  )
}
