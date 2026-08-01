import { useCallback, useEffect, useState } from 'react'
import {
  isIosDevice,
  isPwaStandalone,
  type BeforeInstallPromptEventLike,
} from '../lib/pwa'

/** Баннер: можно установить сайт как приложение */
export function PwaInstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEventLike | null>(null)
  const [visible, setVisible] = useState(false)
  const [iosHint, setIosHint] = useState(false)

  const hide = useCallback(() => {
    setVisible(false)
    setDeferred(null)
  }, [])

  useEffect(() => {
    if (isPwaStandalone()) return

    /* Баннер нужен при каждом запуске вне PWA, даже если Chrome не отдал BIP. */
    const bannerTimer = window.setTimeout(() => setVisible(true), 500)

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEventLike)
      setIosHint(false)
      setVisible(true)
    }

    const onInstalled = () => {
      setVisible(false)
      setDeferred(null)
    }

    window.addEventListener('beforeinstallprompt', onBip)
    window.addEventListener('appinstalled', onInstalled)

    let iosTimer = 0
    if (isIosDevice()) {
      setIosHint(true)
      iosTimer = window.setTimeout(() => setVisible(true), 1400)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBip)
      window.removeEventListener('appinstalled', onInstalled)
      window.clearTimeout(bannerTimer)
      if (iosTimer) window.clearTimeout(iosTimer)
    }
  }, [])

  async function onInstall() {
    if (!deferred) return
    try {
      await deferred.prompt()
      const { outcome } = await deferred.userChoice
      if (outcome !== 'accepted') hide()
    } catch {
      hide()
    }
    setVisible(false)
    setDeferred(null)
  }

  if (!visible) return null

  return (
    <aside className="pwa-install-banner" role="dialog" aria-label="Установка приложения">
      <img
        className="pwa-install-icon"
        src={`${import.meta.env.BASE_URL}icons/icon-192.png`}
        alt=""
        width={44}
        height={44}
      />
      <div className="pwa-install-text">
        <strong>Установите ATM БТК</strong>
        <p>
          {iosHint && !deferred
            ? 'Поделиться → На экран «Домой» — приложение на главном экране'
            : deferred
              ? 'Можно установить как приложение. Работает с главного экрана, без браузерной рамки'
              : 'Откройте меню браузера и выберите «Установить приложение»'}
        </p>
      </div>
      <div className="pwa-install-actions">
        {deferred ? (
          <button type="button" className="btn btn-pill pwa-install-btn" onClick={() => void onInstall()}>
            Установить
          </button>
        ) : null}
        <button
          type="button"
          className="pwa-install-later"
          onClick={hide}
          aria-label="Позже"
        >
          Позже
        </button>
      </div>
    </aside>
  )
}
