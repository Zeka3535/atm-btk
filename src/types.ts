/** Типы демо-заявок — паритет с ATM БТК (mock) */

export type TaskPeriod = 'morning' | 'until17' | 'evening'

export type MetricIcon =
  | 'signal'
  | 'optical'
  | 'modem'
  | 'router'
  | 'thermo'
  | 'attenuation'
  | 'laser'
  | 'speed'
  | 'note'
  | 'calendar'
  | 'delta'
  | 'volt'
  | 'chart'

export type ServiceKind = 'pay' | 'tv' | 'wifi' | 'vip'

/** Вид заявки для демо-бейджа */
export type TaskKind = 'connect' | 'repair' | 'notice' | 'paid'

/** Как getCarrier() в ATM: 0 — медь, 1 — DSLAM, 2 — ZTE xPON, 3 — Huawei xPON */
export type CarrierKind = 0 | 1 | 2 | 3

export type ServiceTabId =
  | 'services'
  | 'dslam'
  | 'zte'
  | 'huawei'
  | 'history'
  | 'primary'
  | 'secondary'

/** Запись истории выездов — как HistoryResult в ATM */
export interface HistoryItem {
  /** Дата, напр. 2026-07-30 */
  date: string
  worker: string
  /** Текст заявки */
  note: string
  /** Текст отчёта */
  closeNote: string
}

export interface MetricRow {
  icon: MetricIcon
  label: string
  value: string
}

/** Услуга абонента (вкладка Сервисы) */
export interface AbonService {
  /** IMS / Телефония / Zala ТВ … */
  type: string
  tariff: string
  status?: 'online' | 'offline' | 'blocked'
  /** Логин/ПО, напр. 160002496270001 */
  login?: string
  /** Городской: 80162XXXXXX */
  cityPhone?: string
}

/** Порт/услуга на вкладке модема (Huawei/ZTE/DSLAM) — как ServiceType в ATM */
export interface ModemPort {
  /** ByFly / IPTV / IMS / Охрана */
  name: string
  enabled: boolean
  /** Логин (ZTE) */
  login?: string
}

/** Панель модема/порта на вкладке носителя */
export interface ModemPanel {
  /** «в сети» / «не в сети» / … */
  modemStatus: string
  /** Состояние порта, напр. [ON] */
  portStatus?: string
  profile?: string
  /** Скорость up/down */
  speed?: string
  ports?: ModemPort[]
}

export interface WifiConfig {
  ssid: string
  password: string
  band?: string
}

/** Снимок вторички (PON) — как карточка в ATM */
export interface PonMeasure {
  at: string
  oltUpDown: string
  onuUpDown: string
  attenuation: string
  delta?: string
  voltage?: string
  laserCurrent?: string
  temperature?: string
  /** ONU Rx (дБм) для графика */
  onuRx: number
}

/** Снимок вторички DSLAM */
export interface DslamMeasure {
  at: string
  speed: string
  snr: string
  attenuation: string
  attainableRate?: string
}

export interface DemoTask {
  id: string
  period: TaskPeriod
  /** Подпись периода на карточке, напр. «до 17», «17-20» */
  periodLabel: string
  dateLabel: string
  address: string
  addressKey: string
  subscriber: string
  /** Один или несколько номеров */
  phones: string[]
  text: string
  /** Код/описание повреждения */
  damage?: string
  /** Подключение / ремонт / извещение / платная */
  kind?: TaskKind
  services: ServiceKind[]
  /** Список услуг для вкладки Сервисы */
  serviceLines?: string[]
  /** Детальные услуги абонента (тариф, городской и т.п.) */
  abonServices?: AbonService[]
  /** Текущие настройки Wi‑Fi роутера (демо) */
  wifi?: WifiConfig
  carrier: CarrierKind
  /** Карточки параметров носителя / первички */
  carrierMetrics?: MetricRow[]
  primaryMetrics?: MetricRow[]
  /** Модем и порты на вкладке Huawei/ZTE/DSLAM */
  modem?: ModemPanel
  /** История измерений вторички (PON) */
  ponMeasures?: PonMeasure[]
  /** История измерений вторички (DSLAM) */
  dslamMeasures?: DslamMeasure[]
  isNew: boolean
  isOtpisano: boolean
  isClosed: boolean
  isSended: boolean
  isIzveschenie: boolean
  reportText: string
  reportDraft: string
  /** День отправки yyyyMMdd или '' */
  reportSentDay: string
  statusNote?: string
  history: HistoryItem[]
}

/** Городской Брест → tel:+375162… */
export function cityTelHref(cityPhone: string): string {
  const digits = cityPhone.replace(/\D/g, '')
  // 80162XXXXXX → +375162XXXXXX
  if (digits.startsWith('80') && digits.length >= 11) return `tel:+375${digits.slice(2)}`
  if (digits.startsWith('0162')) return `tel:+375${digits.slice(1)}`
  if (digits.startsWith('375')) return `tel:+${digits}`
  if (digits.length === 7) return `tel:+375162${digits}`
  return `tel:${digits}`
}

/** Городской номер: #80162434506 */
export function formatCityPhone(cityPhone: string): string {
  const d = cityPhone.replace(/\D/g, '')
  if (d.startsWith('80162') && d.length >= 11) return `#${d}`
  if (d.length === 7) return `#80162${d}`
  const bare = cityPhone.replace(/^#\s*(Стационар\s*)?/i, '').trim()
  return bare.startsWith('#') ? bare : `#${bare}`
}

/** Вкладки как в TasksProvider (ServiceScreen) */
export function screensForCarrier(carrier: CarrierKind): { id: ServiceTabId; title: string }[] {
  const tabs: { id: ServiceTabId; title: string }[] = [{ id: 'services', title: 'Сервисы' }]
  if (carrier === 1) tabs.push({ id: 'dslam', title: 'DSLAM' })
  if (carrier === 2) tabs.push({ id: 'zte', title: 'ZTE xPON' })
  if (carrier === 3) tabs.push({ id: 'huawei', title: 'Huawei xPON' })
  tabs.push({ id: 'history', title: 'История' })
  if (carrier !== 2 && carrier !== 3) tabs.push({ id: 'primary', title: 'Первичка' })
  if (carrier !== 0) tabs.push({ id: 'secondary', title: 'Вторичка' })
  return tabs
}

export function todayYmd(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}${m}${day}`
}

/** Нормализация белорусского мобильного → 375XXXXXXXXX */
export function normalizeBelPhone(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('80') && d.length === 11) d = `375${d.slice(1)}`
  else if (d.startsWith('0') && d.length === 10) d = `375${d.slice(1)}`
  else if (/^(25|29|33|44)\d{7}$/.test(d)) d = `375${d}`
  return d
}

/** Отображение: +375 XX XXX-XX-XX */
export function formatPhoneDisplay(raw: string): string {
  const d = normalizeBelPhone(raw)
  if (d.startsWith('375') && d.length === 12) {
    return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)}-${d.slice(8, 10)}-${d.slice(10)}`
  }
  if (d) return `+${d}`
  return raw.trim()
}

export function yandexMapsUrl(address: string): string {
  return `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`
}

export function googleMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

/** По умолчанию — Яндекс (как приоритет в ATM) */
export function mapsUrl(address: string): string {
  return yandexMapsUrl(address)
}

export function telHref(phone: string): string {
  const d = normalizeBelPhone(phone)
  return d ? `tel:+${d}` : '#'
}

export type CallContact = {
  phone: string
  /** mobile — сотовый; city — городской из услуг */
  kind: 'mobile' | 'city'
}

/** Номера для модалки вызова: сотовые + городской, если есть */
export function taskCallContacts(task: Pick<DemoTask, 'phones' | 'abonServices'>): CallContact[] {
  const out: CallContact[] = []
  const seen = new Set<string>()
  for (const p of task.phones) {
    const key = normalizeBelPhone(p) || p
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push({ phone: p, kind: 'mobile' })
  }
  for (const s of task.abonServices ?? []) {
    if (!s.cityPhone) continue
    const key = s.cityPhone.replace(/\D/g, '')
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push({ phone: s.cityPhone, kind: 'city' })
  }
  return out
}

/** Подсветка tel: в тексте (+375 …, 375…, 8 0XX…, 29/33/44/25…) */
export function linkifyPhones(text: string): { type: 'text' | 'tel'; value: string }[] {
  const re =
    /(\+?375[\s\-]?(?:25|29|33|44)[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}|\+?375\d{9}|8[\s\-]?0(?:25|29|33|44)[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}|(?:25|29|33|44)\d{7})/g
  const parts: { type: 'text' | 'tel'; value: string }[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ type: 'text', value: text.slice(last, m.index) })
    parts.push({ type: 'tel', value: m[0] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) })
  if (parts.length === 0) parts.push({ type: 'text', value: text })
  return parts
}

export const SERVICE_LABEL: Record<ServiceKind, string> = {
  pay: 'Платная',
  tv: 'ТВ',
  wifi: 'Wi‑Fi',
  vip: 'VIP',
}

export const PERIOD_LABEL: Record<TaskPeriod, string> = {
  morning: 'утро',
  until17: 'до 17',
  evening: '17-20',
}
