import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { OneUiStatusBar } from './OneUiStatusBar'

const DevicePortalContext = createContext<HTMLElement | null>(null)
const DESKTOP_PREVIEW_WIDTH = 900
const HASH_MSG = 'atm-btk-hash'

function isDesktopPreview(): boolean {
  const visualWidth = window.visualViewport?.width ?? window.innerWidth
  return Math.min(window.innerWidth, visualWidth) >= DESKTOP_PREVIEW_WIDTH
}

/** UI внутри iframe макета (или ?embed=1) — без внешней рамки */
export function isDeviceEmbed(): boolean {
  try {
    if (window.self !== window.top) return true
  } catch {
    return true
  }
  return new URLSearchParams(window.location.search).get('embed') === '1'
}

function buildEmbedSrc(): string {
  const url = new URL(window.location.href)
  url.searchParams.set('embed', '1')
  if (!url.hash) url.hash = '#/tasks'
  return `${url.pathname}${url.search}${url.hash}`
}

/** Корень для порталов (модалки) — в iframe не нужен */
export function useDevicePortalRoot(): HTMLElement | null {
  return useContext(DevicePortalContext)
}

/**
 * На широком ПК — рамка Samsung + iframe (scale снаружи → стекло внутри).
 * На узком экране / в embed — UI на всю ширину.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [desktopPreview, setDesktopPreview] = useState(isDesktopPreview)
  const embed = useMemo(() => isDeviceEmbed(), [])
  const iframeSrc = useMemo(() => buildEmbedSrc(), [])

  useEffect(() => {
    if (embed) {
      document.documentElement.classList.add('device-embed')
      return () => document.documentElement.classList.remove('device-embed')
    }
    return undefined
  }, [embed])

  useEffect(() => {
    if (embed) return
    const syncPreview = () => setDesktopPreview(isDesktopPreview())
    const viewport = window.visualViewport
    syncPreview()
    window.addEventListener('resize', syncPreview)
    viewport?.addEventListener('resize', syncPreview)
    return () => {
      window.removeEventListener('resize', syncPreview)
      viewport?.removeEventListener('resize', syncPreview)
    }
  }, [embed])

  /* Embed → parent: hash */
  useEffect(() => {
    if (!embed || window.parent === window) return
    const post = () => {
      window.parent.postMessage(
        { type: HASH_MSG, hash: window.location.hash || '#/' },
        window.location.origin,
      )
    }
    post()
    window.addEventListener('hashchange', post)
    return () => window.removeEventListener('hashchange', post)
  }, [embed])

  /* Parent ↔ iframe: hash */
  useEffect(() => {
    if (embed || !desktopPreview) return

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.type !== HASH_MSG || typeof e.data.hash !== 'string') return
      if (window.location.hash !== e.data.hash) {
        window.history.replaceState(null, '', e.data.hash)
      }
    }

    const pushHashToIframe = () => {
      const win = iframeRef.current?.contentWindow
      if (!win) return
      const next = window.location.hash || '#/'
      try {
        if (win.location.hash !== next) win.location.hash = next
      } catch {
        /* ignore */
      }
    }

    window.addEventListener('message', onMessage)
    window.addEventListener('hashchange', pushHashToIframe)
    return () => {
      window.removeEventListener('message', onMessage)
      window.removeEventListener('hashchange', pushHashToIframe)
    }
  }, [embed, desktopPreview])

  if (embed) {
    return (
      <DevicePortalContext.Provider value={null}>
        <OneUiStatusBar />
        {children}
      </DevicePortalContext.Provider>
    )
  }

  if (!desktopPreview) {
    return <DevicePortalContext.Provider value={null}>{children}</DevicePortalContext.Provider>
  }

  return (
    <DevicePortalContext.Provider value={null}>
      <div className="device-stage">
        <div className="device-phone device-samsung" aria-label="Макет Samsung Galaxy">
          <span className="device-btn device-btn-vol-up" aria-hidden />
          <span className="device-btn device-btn-vol-down" aria-hidden />
          <span className="device-btn device-btn-power" aria-hidden />
          <div className="device-bezel">
            <div className="device-screen-clip">
              <div className="device-punch" aria-hidden />
              <iframe
                ref={iframeRef}
                className="device-screen-iframe"
                title="ATM БТК"
                src={iframeSrc}
                onLoad={() => {
                  const win = iframeRef.current?.contentWindow
                  if (!win) return
                  const next = window.location.hash || '#/'
                  try {
                    if (win.location.hash !== next) win.location.hash = next
                  } catch {
                    /* ignore */
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </DevicePortalContext.Provider>
  )
}
