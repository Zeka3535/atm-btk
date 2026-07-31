/** Настройки PWA: портрет, цвет системной панели */

const THEME = '#663479'

export function setupPwaChrome() {
  document.documentElement.style.setProperty('--btk-status', THEME)

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', THEME)

  void lockPortrait()
  window.addEventListener('orientationchange', () => {
    void lockPortrait()
  })
}

async function lockPortrait() {
  try {
    const orient = screen.orientation as ScreenOrientation & {
      lock?: (o: string) => Promise<void>
    }
    if (typeof orient?.lock === 'function') {
      await orient.lock('portrait')
    }
  } catch {
    /* браузер/жесткость ОС — только portrait в manifest */
  }
}
