import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { MOCK_TASKS, isReportSentToday } from '../data/mockTasks'
import { ensureNotifyPermission, playNotifyBeep, showSystemNotify } from '../lib/notify'
import type { DemoTask } from '../types'
import { todayYmd } from '../types'

const BG_POLL_MS = 60_000
const REFRESH_DELAY_MS = 750

/** Слияние ответа сервера с локальными правками (отчёт, прочитано, Wi‑Fi) */
function mergeTasksFromServer(local: DemoTask[], server: DemoTask[]): DemoTask[] {
  const byId = new Map(local.map((t) => [t.id, t]))
  return server.map((base) => {
    const cur = byId.get(base.id)
    const next = structuredClone(base)
    if (!cur) return next
    return {
      ...next,
      isNew: cur.isNew,
      isOtpisano: cur.isOtpisano,
      isClosed: cur.isClosed,
      isSended: cur.isSended,
      isIzveschenie: cur.isIzveschenie,
      reportText: cur.reportText,
      reportDraft: cur.reportDraft,
      reportSentDay: cur.reportSentDay,
      history: cur.history,
      wifi: cur.wifi ?? next.wifi,
      abonServices: cur.abonServices ?? next.abonServices,
      equipment: cur.equipment ?? next.equipment,
      lanDevices: cur.lanDevices ?? next.lanDevices,
      traffic: cur.traffic ?? next.traffic,
      modem: cur.modem ?? next.modem,
      statusNote: cur.statusNote ?? next.statusNote,
    }
  })
}

export interface ToastPayload {
  title: string
  message?: string
}

interface DemoContextValue {
  loggedIn: boolean
  accountName: string
  login: (login: string) => void
  logout: () => void
  offline: boolean
  setOffline: (v: boolean) => void
  offlineSince: string
  tasks: DemoTask[]
  getTask: (id: string) => DemoTask | undefined
  markRead: (id: string) => void
  markAllListSeen: () => void
  updateTask: (id: string, patch: Partial<DemoTask>) => void
  /** Обновление списка (pull / фон) — без тостов */
  refreshTasks: () => Promise<boolean>
  refreshing: boolean
  sendReport: (id: string, text: string) => { ok: boolean; error?: string }
  notifySound: boolean
  setNotifySound: (v: boolean) => void
  notifyVibrate: boolean
  setNotifyVibrate: (v: boolean) => void
  notifyEnabled: boolean
  setNotifyEnabled: (v: boolean) => void
  /** Тест: in-app snackbar + системное уведомление */
  demoNotifyNewTask: (address?: string) => Promise<void>
  toast: ToastPayload | null
  showToast: (title: string, message?: string) => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

const AUTH_KEY = 'atm_pwa_auth'
/** ФИО специалиста в демо (конкурсная заявка) */
const SPECIALIST_FIO = 'Чайка Евгений Игоревич'
const OFFLINE_KEY = 'atm_pwa_offline'
const NOTIFY_KEY = 'atm_pwa_notify'
const SOUND_KEY = 'atm_pwa_notify_sound'
const VIBRATE_KEY = 'atm_pwa_notify_vibrate'

function capitalizeSnack(msg: string): string {
  const t = msg.trim()
  if (!t) return t
  return t
    .split('. ')
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join('. ')
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem(AUTH_KEY) === '1')
  const [accountName] = useState(SPECIALIST_FIO)
  const [offline, setOfflineState] = useState(() => localStorage.getItem(OFFLINE_KEY) === '1')
  const [offlineSince] = useState(() =>
    new Date().toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  )
  const [tasks, setTasks] = useState<DemoTask[]>(() => structuredClone(MOCK_TASKS))
  const [refreshing, setRefreshing] = useState(false)
  const refreshLock = useRef(false)
  const [notifySound, setNotifySoundState] = useState(() => localStorage.getItem(SOUND_KEY) !== '0')
  const [notifyVibrate, setNotifyVibrateState] = useState(() => localStorage.getItem(VIBRATE_KEY) !== '0')
  const [notifyEnabled, setNotifyEnabledState] = useState(() => localStorage.getItem(NOTIFY_KEY) !== '0')
  const [toast, setToast] = useState<ToastPayload | null>(null)
  const offlineRef = useRef(offline)
  offlineRef.current = offline

  const login = useCallback((loginName: string) => {
    if (!loginName.trim()) return
    localStorage.setItem(AUTH_KEY, '1')
    setLoggedIn(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setLoggedIn(false)
  }, [])

  const setOffline = useCallback((v: boolean) => {
    localStorage.setItem(OFFLINE_KEY, v ? '1' : '0')
    setOfflineState(v)
  }, [])

  const getTask = useCallback((id: string) => tasks.find((t) => t.id === id), [tasks])

  const markRead = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isNew: false } : t)))
  }, [])

  const markAllListSeen = useCallback(() => {
    // Просмотр списка = прочитано при следующем «сеансе» — в демо снимаем «Новая» у видимых
    setTasks((prev) => prev.map((t) => ({ ...t, isNew: false })))
  }, [])

  const updateTask = useCallback((id: string, patch: Partial<DemoTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }, [])

  const showToast = useCallback((title: string, message?: string) => {
    setToast({
      title: capitalizeSnack(title),
      message: message ? capitalizeSnack(message) : undefined,
    })
    window.setTimeout(() => setToast(null), 2200)
  }, [])

  const refreshTasks = useCallback(async () => {
    if (refreshLock.current) return false
    if (offlineRef.current) return false
    refreshLock.current = true
    setRefreshing(true)
    try {
      await new Promise((r) => window.setTimeout(r, REFRESH_DELAY_MS))
      if (offlineRef.current) return false
      setTasks((prev) => mergeTasksFromServer(prev, MOCK_TASKS))
      return true
    } finally {
      refreshLock.current = false
      setRefreshing(false)
    }
  }, [])

  /* Фоновый опрос списка (как BtkTaskPollRunner), пауза офлайн / скрытая вкладка */
  useEffect(() => {
    if (!loggedIn || offline) return
    const tick = () => {
      if (document.hidden || offlineRef.current) return
      void refreshTasks()
    }
    const id = window.setInterval(tick, BG_POLL_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [loggedIn, offline, refreshTasks])

  const setNotifyEnabled = useCallback(
    (v: boolean) => {
      localStorage.setItem(NOTIFY_KEY, v ? '1' : '0')
      setNotifyEnabledState(v)
      if (v) void ensureNotifyPermission()
    },
    [],
  )

  const setNotifySound = useCallback((v: boolean) => {
    localStorage.setItem(SOUND_KEY, v ? '1' : '0')
    setNotifySoundState(v)
  }, [])

  const setNotifyVibrate = useCallback((v: boolean) => {
    localStorage.setItem(VIBRATE_KEY, v ? '1' : '0')
    setNotifyVibrateState(v)
  }, [])

  const demoNotifyNewTask = useCallback(
    async (address = 'Г. Брест, ул. Московская, 45') => {
      if (!notifyEnabled) {
        showToast('Включите уведомления в настройках')
        return
      }
      const title = 'Добавлена заявка'
      showToast(title, address)
      if (notifyVibrate && navigator.vibrate) navigator.vibrate(40)
      if (notifySound) playNotifyBeep()
      await showSystemNotify(title, address, !notifySound)
    },
    [notifyEnabled, notifySound, notifyVibrate, showToast],
  )

  const sendReport = useCallback(
    (id: string, text: string) => {
      const task = tasks.find((t) => t.id === id)
      if (!task) return { ok: false, error: 'Заявка не найдена' }
      if (task.isClosed) return { ok: false, error: 'Заявка закрыта. Отчёт нельзя отправить' }
      const trimmed = text.trim()
      if (!trimmed) return { ok: false, error: 'Введите текст отчёта' }
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                reportText: trimmed,
                reportDraft: '',
                isSended: true,
                isOtpisano: false,
                isNew: false,
                reportSentDay: todayYmd(),
                history: [
                  ...t.history,
                  {
                    date: new Date().toISOString().slice(0, 10),
                    worker: 'Монтажник',
                    note: t.text,
                    closeNote: trimmed,
                  },
                ],
              }
            : t,
        ),
      )
      showToast('Отчёт послан')
      return { ok: true }
    },
    [tasks, showToast],
  )

  const value = useMemo(
    () => ({
      loggedIn,
      accountName,
      login,
      logout,
      offline,
      setOffline,
      offlineSince,
      tasks,
      getTask,
      markRead,
      markAllListSeen,
      updateTask,
      refreshTasks,
      refreshing,
      sendReport,
      notifySound,
      setNotifySound,
      notifyVibrate,
      setNotifyVibrate,
      notifyEnabled,
      setNotifyEnabled,
      demoNotifyNewTask,
      toast,
      showToast,
    }),
    [
      loggedIn,
      accountName,
      login,
      logout,
      offline,
      setOffline,
      offlineSince,
      tasks,
      getTask,
      markRead,
      markAllListSeen,
      updateTask,
      refreshTasks,
      refreshing,
      sendReport,
      notifySound,
      setNotifySound,
      notifyVibrate,
      setNotifyVibrate,
      notifyEnabled,
      setNotifyEnabled,
      demoNotifyNewTask,
      toast,
      showToast,
    ],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo вне DemoProvider')
  return ctx
}

export { isReportSentToday }
