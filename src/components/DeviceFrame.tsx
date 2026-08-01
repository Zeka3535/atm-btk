import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { OneUiStatusBar } from './OneUiStatusBar'

const DevicePortalContext = createContext<HTMLElement | null>(null)

/** Корень для порталов (модалки) — экран виртуального телефона */
export function useDevicePortalRoot(): HTMLElement | null {
  return useContext(DevicePortalContext)
}

/**
 * На широком ПК — UI в рамке Samsung Galaxy по центру.
 * На узком экране — без рамки, на всю ширину.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const screenRef = useRef<HTMLDivElement>(null)
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)

  useLayoutEffect(() => {
    setPortalEl(screenRef.current)
  }, [])

  return (
    <DevicePortalContext.Provider value={portalEl}>
      <div className="device-stage">
        <div className="device-phone device-samsung" aria-label="Макет Samsung Galaxy">
          <span className="device-btn device-btn-vol-up" aria-hidden />
          <span className="device-btn device-btn-vol-down" aria-hidden />
          <span className="device-btn device-btn-power" aria-hidden />
          <div className="device-bezel">
            <div className="device-screen-clip">
              <div className="device-punch" aria-hidden />
              <div
                ref={screenRef}
                id="device-screen"
                className="device-screen"
              >
                <OneUiStatusBar />
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DevicePortalContext.Provider>
  )
}
