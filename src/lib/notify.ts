/** Звук / системное уведомление (демо) */

export function playNotifyBeep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.value = 0.08
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
    osc.stop(ctx.currentTime + 0.2)
    window.setTimeout(() => void ctx.close(), 300)
  } catch {
    /* нет AudioContext */
  }
}

export async function ensureNotifyPermission(): Promise<boolean> {
  if (typeof Notification === 'undefined') return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const r = await Notification.requestPermission()
  return r === 'granted'
}

export async function showSystemNotify(title: string, body: string, silent: boolean) {
  if (typeof Notification === 'undefined') return
  const ok = await ensureNotifyPermission()
  if (!ok) return
  try {
    const iconBase = import.meta.env.BASE_URL
    new Notification(title, {
      body,
      silent,
      tag: 'atm-btk-demo',
      icon: `${iconBase}icons/icon-192.png`,
      badge: `${iconBase}icons/icon-192.png`,
    })
  } catch {
    /* браузер отклонил */
  }
}
