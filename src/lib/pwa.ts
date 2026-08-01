/** Настройки PWA: портрет, цвет системной панели, установка */

export const PWA_THEME = '#663479'
/** Цвет системной панели при открытой модалке */
export const PWA_THEME_MODAL = '#3d1f49'

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
      /* Не сбрасывать тёмный цвет, пока открыта модалка */
      if (!document.querySelector('.modal-backdrop')) {
        applyThemeColor(PWA_THEME)
      }
      void lockPortrait()
    }
  })
}

/** Цвет системной статус-панели (theme-color), без перекраски фона страницы */
export function applyThemeColor(color: string) {
  const root = document.documentElement
  root.style.setProperty('--btk-status', color)
  /* Не красить html/body — фон страницы остаётся --btk-bg */
  root.style.removeProperty('background-color')
  if (document.body) document.body.style.removeProperty('background-color')

  /* Один meta без media — Android быстрее подхватывает смену theme-color */
  let meta = document.querySelector('meta[name="theme-color"]:not([media])') as HTMLMetaElement | null
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.insertBefore(meta, document.head.firstChild)
  }
  meta.content = color

  document.querySelectorAll('meta[name="theme-color"][media]').forEach((m) => {
    m.setAttribute('content', color)
  })

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
