/** Настройки PWA: портрет, цвет системной панели, установка */

export const PWA_THEME = '#663479'

export type BeforeInstallPromptEventLike = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function setupPwaChrome() {
  applyThemeColor(PWA_THEME)
  void lockPortrait()

  window.addEventListener('orientationchange', () => {
    void lockPortrait()
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      applyThemeColor(PWA_THEME)
      void lockPortrait()
    }
  })
}

/** Цвет системной статус-панели = тулбар ATM */
export function applyThemeColor(color: string) {
  document.documentElement.style.setProperty('--btk-status', color)
  document.documentElement.style.backgroundColor = color

  const metas = document.querySelectorAll('meta[name="theme-color"]')
  if (metas.length === 0) {
    const m = document.createElement('meta')
    m.name = 'theme-color'
    m.content = color
    document.head.appendChild(m)
    return
  }
  metas.forEach((m) => m.setAttribute('content', color))

  const tile = document.querySelector('meta[name="msapplication-TileColor"]')
  if (tile) tile.setAttribute('content', color)
}

export function isPwaStandalone(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean }
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    nav.standalone === true
  )
}

export function isIosDevice(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

async function lockPortrait() {
  try {
    const orient = screen.orientation as ScreenOrientation & {
      lock?: (o: OrientationLockType | string) => Promise<void>
    }
    if (typeof orient?.lock === 'function') {
      await orient.lock('portrait')
    }
  } catch {
    /* браузер/ОС — только portrait в manifest */
  }
}
