import { useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { ContactsModal } from '../components/ContactsModal'
import { MapsModal } from '../components/MapsModal'
import {
  IconChart,
  IconCloudOff,
  IconModem,
  IconRouter,
  IconTv,
  IconUser,
  MetricGlyph,
} from '../components/icons'
import { BackToolbar } from '../components/NavChrome'
import { ReportModal } from '../components/ReportModal'
import { TabsScroll } from '../components/TabsScroll'
import { TaskCard } from '../components/TaskCard'
import { WifiSettingsModal } from '../components/WifiSettingsModal'
import { LinkedText, Modal } from '../components/UiKit'
import { useDemo } from '../context/DemoContext'
import type {
  AbonService,
  CallContact,
  DemoTask,
  DslamMeasure,
  MetricIcon,
  MetricRow,
  ModemPanel,
  ModemPort,
  PonMeasure,
  ServiceTabId,
} from '../types'
import {
  cityTelHref,
  formatCityPhoneLine,
  screensForCarrier,
  serviceCityPhones,
} from '../types'

function formatHistoryDate(raw: string) {
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return raw
  return `${m[3]}.${m[2]}.${m[1]}`
}

/** Фамилия и инициалы: «Иванов Иван Петрович» → «Иванов И.П.» */
function formatWorkerShort(raw: string) {
  const parts = raw.trim().split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return raw.trim()
  /* Уже короткий вид: «Иванов И.П.» */
  if (parts.length === 2 && /^[A-ZА-ЯЁ](?:\.[A-ZА-ЯЁ])+\.?$/i.test(parts[1])) {
    const ini = parts[1].endsWith('.') ? parts[1] : `${parts[1]}.`
    return `${parts[0]} ${ini}`
  }
  const surname = parts[0]
  const initials = parts
    .slice(1)
    .map((p) => {
      const ch = p.match(/[A-ZА-ЯЁ]/i)?.[0]
      return ch ? `${ch.toUpperCase()}.` : ''
    })
    .join('')
  return `${surname} ${initials}`.trim()
}

export function TaskDetailPage() {
  const { id } = useParams()
  const { getTask, markRead, showToast } = useDemo()
  const task = id ? getTask(id) : undefined
  const tabs = useMemo(() => (task ? screensForCarrier(task.carrier) : []), [task])
  const [tab, setTab] = useState<ServiceTabId>('services')
  const [reportOpen, setReportOpen] = useState(false)
  const [wifiOpen, setWifiOpen] = useState(false)
  const [contacts, setContacts] = useState<CallContact[] | null>(null)
  const [mapAddr, setMapAddr] = useState<string | null>(null)

  useEffect(() => {
    if (id) markRead(id)
  }, [id, markRead])

  useEffect(() => {
    if (tabs.length && !tabs.some((t) => t.id === tab)) setTab(tabs[0].id)
  }, [tabs, tab])

  if (!task) {
    return (
      <div className="page detail-page">
        <div className="detail-sticky-chrome">
          <BackToolbar title="Назад" />
        </div>
        <p>Заявка не найдена</p>
      </div>
    )
  }

  const showHeadCard = tab === 'services' || tab === 'dslam' || tab === 'zte' || tab === 'huawei'

  return (
    <div className="page detail-page">
      <div className="detail-sticky-chrome">
        <BackToolbar title="Назад" />
        <TabsScroll activeId={tab}>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? 'tab on' : 'tab'}
              onClick={() => setTab(t.id)}
            >
              {t.title}
            </button>
          ))}
        </TabsScroll>
      </div>

      {showHeadCard && (
        <TaskCard
          task={task}
          embedded
          onReport={(tid) => {
            if (task.isClosed) {
              showToast('Заявка закрыта. Отчёт нельзя отправить')
              return
            }
            setReportOpen(true)
            void tid
          }}
          onContacts={setContacts}
          onMaps={setMapAddr}
          onWifi={() => setWifiOpen(true)}
        />
      )}

      <div className="detail-tab-body">
        <TabBody task={task} tab={tab} onWifi={() => setWifiOpen(true)} />
      </div>

      <ReportModal taskId={reportOpen ? task.id : null} onClose={() => setReportOpen(false)} />
      <WifiSettingsModal taskId={wifiOpen ? task.id : null} onClose={() => setWifiOpen(false)} />
      <ContactsModal contacts={contacts} onClose={() => setContacts(null)} />
      <MapsModal address={mapAddr} onClose={() => setMapAddr(null)} />
    </div>
  )
}

function TabBody({
  task,
  tab,
  onWifi,
}: {
  task: DemoTask
  tab: ServiceTabId
  onWifi: () => void
}) {
  if (tab === 'services') {
    const list = task.abonServices ?? []
    const wifiSvc = list.find((s) => /wi/i.test(s.type))
    const servicesOnly = list.filter((s) => !/wi/i.test(s.type))
    const linesOnly = (task.serviceLines ?? []).filter((line) => !/wi/i.test(line))
    const showWifi =
      !!task.wifi || !!wifiSvc || (task.services?.includes('wifi') ?? false)
    const emptyServices =
      servicesOnly.length === 0 && linesOnly.length === 0 && !showWifi

    return (
      <div className="detail-block stitch-services">
        <div className="section-head">
          <h3>Подключенные услуги</h3>
        </div>

        {emptyServices && <p className="muted">Услуги не привязаны к заявке</p>}

        {servicesOnly.length > 0 ? (
          <ul className="abon-service-list stitch-svc-list">
            {groupAbonServices(servicesOnly).map((item) =>
              item.kind === 'phones' ? (
                <TelephonyServiceRow
                  key={`tel-${item.phones.join('-')}`}
                  service={item.service}
                  phones={item.phones}
                />
              ) : (
                <AbonServiceRow
                  key={`${item.service.type}-${item.service.tariff}-${item.service.login ?? ''}`}
                  service={item.service}
                />
              ),
            )}
          </ul>
        ) : (
          linesOnly.length > 0 && (
            <ul className="service-list">
              {linesOnly.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )
        )}

        {showWifi && (
          <>
            <div className="section-head wifi-status-head">
              <h3>Состояние Wi‑Fi</h3>
            </div>
            <ul className="abon-service-list stitch-svc-list">
              <WifiStatusRow
                ssid={task.wifi?.ssid}
                status={wifiSvc?.status}
                onWifi={onWifi}
              />
            </ul>
          </>
        )}
      </div>
    )
  }

  if (tab === 'history') {
    return (
      <div className="detail-block stitch-history">
        <div className="section-head">
          <h3>История действий</h3>
        </div>
        {task.history.length === 0 && <p className="muted">История пуста</p>}
        <ol className="stitch-timeline">
          {task.history.map((h, i) => {
            const hasReport = Boolean(h.closeNote && h.closeNote !== '—')
            return (
              <li key={i} className="stitch-tl-item">
                <article className="stitch-tl-card">
                  <header className="stitch-tl-head">
                    <time className="stitch-tl-date" dateTime={h.date}>
                      {formatHistoryDate(h.date)}
                    </time>
                    <span className="stitch-tl-worker">
                      <IconUser size={14} />
                      {formatWorkerShort(h.worker)}
                    </span>
                  </header>
                  <div className="stitch-tl-section">
                    <p className="stitch-tl-label">Заявка</p>
                    <p className="stitch-tl-note">
                      <LinkedText text={h.note} />
                    </p>
                  </div>
                  {hasReport && (
                    <div className="stitch-tl-report">
                      <p className="stitch-tl-label">Отчёт</p>
                      <p className="stitch-tl-note">
                        <LinkedText text={h.closeNote} />
                      </p>
                    </div>
                  )}
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    )
  }

  if (tab === 'dslam' || tab === 'zte' || tab === 'huawei') {
    const title = tab === 'dslam' ? 'DSLAM' : tab === 'zte' ? 'ZTE xPON' : 'Huawei xPON'
    return (
      <CarrierTabBlock
        title={title}
        kind={tab}
        modem={task.modem}
        rows={task.carrierMetrics}
        onWifi={onWifi}
      />
    )
  }

  if (tab === 'primary') {
    return (
      <MetricsBlock
        title="Первичка"
        rows={task.primaryMetrics}
        empty="Данные первичной сети не загружены"
      />
    )
  }

  return <SecondaryMeasures task={task} />
}

function serviceTone(type: string): 'cyan' | 'orange' | 'green' | 'purple' {
  const t = type.toLowerCase()
  if (t.includes('zala') || t.includes('тв') || t.includes('tv')) return 'orange'
  if (t.includes('телефон') || t.includes('ims') || t.includes('город')) return 'green'
  if (t.includes('wi')) return 'purple'
  return 'cyan'
}

function ServiceGlyph({ type }: { type: string }) {
  const tone = serviceTone(type)
  if (tone === 'orange') return <IconTv size={22} />
  if (tone === 'green') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M6.62,10.79c1.44,2.83 3.76,5.14 6.59,6.59l2.2,-2.2c0.27,-0.27 0.67,-0.36 1.02,-0.24 1.12,0.37 2.33,0.57 3.57,0.57 0.55,0 1,0.45 1,1V20c0,0.55 -0.45,1 -1,1 -9.39,0 -17,-7.61 -17,-17 0,-0.55 0.45,-1 1,-1h3.5c0.55,0 1,0.45 1,1 0,1.25 0.2,2.45 0.57,3.57 0.11,0.35 0.03,0.74 -0.25,1.02l-2.2,2.2z" />
      </svg>
    )
  }
  return <IconRouter size={22} />
}

function isTelephonyService(s: AbonService) {
  return /телефон|ims|город/i.test(s.type) && serviceCityPhones(s).length > 0
}

/** Сгруппировать телефонию с несколькими городскими в один сворачиваемый блок */
function groupAbonServices(list: AbonService[]) {
  type Item =
    | { kind: 'single'; service: AbonService }
    | { kind: 'phones'; service: AbonService; phones: string[] }
  const out: Item[] = []
  let telBucket: AbonService[] = []

  function flushTel() {
    if (telBucket.length === 0) return
    const phones: string[] = []
    const seen = new Set<string>()
    for (const s of telBucket) {
      for (const p of serviceCityPhones(s)) {
        const k = p.replace(/\D/g, '')
        if (!k || seen.has(k)) continue
        seen.add(k)
        phones.push(p)
      }
    }
    out.push({ kind: 'phones', service: telBucket[0], phones })
    telBucket = []
  }

  for (const s of list) {
    if (isTelephonyService(s)) {
      telBucket.push(s)
    } else {
      flushTel()
      out.push({ kind: 'single', service: s })
    }
  }
  flushTel()
  return out
}

function AbonServiceRow({ service }: { service: AbonService }) {
  const tone = serviceTone(service.type)

  return (
    <li className={`stitch-svc-card tone-${tone}`}>
      <div className={`stitch-svc-ico tone-${tone}`} aria-hidden>
        <ServiceGlyph type={service.type} />
      </div>
      <div className="stitch-svc-body">
        <strong>{service.type}</strong>
        {service.login && (
          <div className="stitch-svc-meta">
            Логин: <span className="mono">{service.login}</span>
          </div>
        )}
        {service.tariff && <div className="stitch-svc-tariff">{service.tariff}</div>}
      </div>
    </li>
  )
}

/** Wi‑Fi — не услуга: отдельно, вместо «Роутер» — имя сети */
function WifiStatusRow({
  ssid,
  status,
  onWifi,
}: {
  ssid?: string
  status?: AbonService['status']
  onWifi: () => void
}) {
  const statusLabel =
    status === 'online' ? 'В сети' : status === 'offline' ? 'Не в сети' : status === 'blocked' ? 'Блок' : null

  return (
    <li className="stitch-svc-card tone-purple">
      <div className="stitch-svc-ico tone-purple" aria-hidden>
        <ServiceGlyph type="Wi‑Fi" />
      </div>
      <div className="stitch-svc-body">
        <strong>{ssid?.trim() || 'Сеть не задана'}</strong>
        {statusLabel && <div className="stitch-svc-tariff">{statusLabel}</div>}
      </div>
      <button type="button" className="stitch-svc-setup" onClick={onWifi}>
        Настроить
      </button>
    </li>
  )
}

/** Телефония: один номер или сворачиваемый список (юрлица) */
function TelephonyServiceRow({
  service,
  phones,
}: {
  service: AbonService
  phones: string[]
}) {
  const [expanded, setExpanded] = useState(false)
  const many = phones.length > 1
  const visible = many && !expanded ? phones.slice(0, 1) : phones
  const online = service.status === 'online'
  const tone = 'green' as const

  return (
    <li className={`stitch-svc-card tone-${tone}`}>
      <div className={`stitch-svc-ico tone-${tone}`} aria-hidden>
        <ServiceGlyph type={service.type} />
      </div>
      <div className="stitch-svc-body">
        <strong>
          {service.type}
          {many && <span className="stitch-svc-count"> · {phones.length}</span>}
        </strong>
        {service.tariff && <div className="stitch-svc-tariff">{service.tariff}</div>}
        <ul className={`stitch-city-phones${expanded ? ' open' : ''}`}>
          {visible.map((p) => (
            <li key={p} className="stitch-city-phone">
              <a href={cityTelHref(p)}>{formatCityPhoneLine(p)}</a>
              {online && (
                <span className="svc-live">
                  <span className="svc-live-dot" /> Активен
                </span>
              )}
            </li>
          ))}
        </ul>
        {many && (
          <button
            type="button"
            className="stitch-city-toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? 'Свернуть' : `Ещё ${phones.length - 1}`}
          </button>
        )}
      </div>
    </li>
  )
}

function isModemOnline(status: string) {
  return status.trim().toLowerCase() === 'в сети'
}

function isLosStatus(status: string) {
  const s = status.trim().toLowerCase()
  return s === 'los' || s.includes('потеря')
}

/** Подпись статуса модема: «В сети» / «LOS» / исходный текст */
function formatModemStatusLabel(status: string, online: boolean) {
  if (online) return 'В сети'
  if (isLosStatus(status)) return 'LOS'
  if (status.trim().toLowerCase() === 'в сети') return 'Не в сети'
  const t = status.trim()
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : 'Не в сети'
}

/** Вкладка носителя — визуал Stitch Huawei / DSLAM */
function CarrierTabBlock({
  title,
  kind,
  modem,
  rows,
  onWifi,
}: {
  title: string
  kind: 'dslam' | 'zte' | 'huawei'
  modem?: ModemPanel
  rows?: MetricRow[]
  onWifi: () => void
}) {
  const { showToast } = useDemo()
  const [ports, setPorts] = useState<ModemPort[]>(modem?.ports ?? [])
  const [portOn, setPortOn] = useState(
    () => !!modem?.portStatus && /\[?\s*on\s*\]?/i.test(modem.portStatus),
  )
  const modemOn = modem ? isModemOnline(modem.modemStatus) : false

  useEffect(() => {
    setPorts(modem?.ports ?? [])
    setPortOn(!!modem?.portStatus && /\[?\s*on\s*\]?/i.test(modem.portStatus))
  }, [modem])

  const modemLabel = modem ? formatModemStatusLabel(modem.modemStatus, modemOn) : ''
  const modemLos = !!modem && !modemOn && isLosStatus(modem.modemStatus)

  const togglePort = (name: string) => {
    setPorts((prev) =>
      prev.map((p) => (p.name === name ? { ...p, enabled: !p.enabled } : p)),
    )
  }

  const hasMetrics = rows && rows.length > 0
  const isDslam = kind === 'dslam'

  return (
    <div className="detail-block carrier-tab stitch-carrier">
      {modem && (
        <>
          {/* Состояние модема — отдельной строкой над блоком услуги/порта */}
          <div className={`carrier-modem-bar${modemOn ? ' on' : modemLos ? ' los' : ' off'}`}>
            <span className="carrier-modem-label">Модем</span>
            <p
              className={`carrier-modem-status${modemOn ? ' on' : modemLos ? ' los' : ' off'}`}
            >
              <span className="carrier-live-dot" />
              {modemLabel}
            </p>
          </div>

          <div className="carrier-hero">
            <div className="carrier-hero-left">
              <span className={`carrier-hero-ico${portOn ? ' on' : ''}`} aria-hidden>
                <IconRouter size={22} />
              </span>
              <div>
                <h3 className="carrier-hero-title">{title}</h3>
                <p className={`carrier-hero-status${portOn ? ' on' : ' off'}`}>Порт</p>
              </div>
            </div>
            <div className="carrier-hero-right">
              <button
                type="button"
                className={`toggle toggle-accent${portOn ? ' on' : ''}`}
                aria-label={portOn ? 'Порт включён' : 'Порт выключен'}
                onClick={() => setPortOn((v) => !v)}
              >
                <span className="toggle-knob" />
              </button>
            </div>
          </div>
        </>
      )}

      {!modem && <h3>{title}</h3>}

      {modem && (modem.profile || modem.speed) && (
        <div className="carrier-plan">
          {modem.profile && (
            <div>
              <p className="carrier-plan-label">Тарифный план / профиль</p>
              <p className="carrier-plan-value">{modem.profile}</p>
            </div>
          )}
          {modem.speed && <p className="carrier-plan-speed">{modem.speed}</p>}
          {ports.length > 0 && (
            <div className="carrier-port-chips">
              {ports.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  className={`carrier-chip${p.enabled ? ' on' : ''}`}
                  onClick={() => togglePort(p.name)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {hasMetrics && (
        <ul className={`metric-list${isDslam ? ' metric-bento' : ' stitch-metric-list'}`}>
          {rows!.map((row) => (
            <li key={row.label} className={`metric-row metric-${row.icon}${isDslam ? ' bento' : ''}`}>
              <span className="metric-icon" aria-hidden>
                <MetricGlyph name={row.icon} size={20} />
              </span>
              <div className="metric-text">
                <div className="metric-label">{row.label}</div>
                <div className="metric-value">{row.value}</div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!hasMetrics && !modem && <p className="muted">Параметры носителя недоступны (демо)</p>}

      <div className="carrier-actions">
        <button type="button" className="carrier-action-card" onClick={onWifi}>
          <IconRouter size={22} />
          <span>
            Настройки
            <br />
            Wi‑Fi
          </span>
        </button>
        <button
          type="button"
          className="carrier-action-card"
          onClick={() => showToast('Перезагрузка порта (демо)')}
        >
          <IconModem size={22} />
          <span>
            Перезагрузить
            <br />
            порт
          </span>
        </button>
        <button
          type="button"
          className="carrier-action-card"
          onClick={() => showToast('Перезагрузка модема (демо)')}
        >
          <IconModem size={22} />
          <span>
            Перезагрузить
            <br />
            модем
          </span>
        </button>
        <button
          type="button"
          className="carrier-action-card"
          onClick={() => showToast('Сессия разорвана (демо)')}
        >
          <IconCloudOff size={22} />
          <span>
            Разорвать
            <br />
            сессию
          </span>
        </button>
      </div>
    </div>
  )
}

function MetricsBlock({
  title,
  rows,
  empty,
}: {
  title: string
  rows?: MetricRow[]
  empty: string
}) {
  return (
    <div className="detail-block">
      <h3>{title}</h3>
      {(!rows || rows.length === 0) && <p className="muted">{empty}</p>}
      <ul className="metric-list">
        {(rows ?? []).map((row) => (
          <li key={row.label} className={`metric-row metric-${row.icon}`}>
            <span className="metric-icon" aria-hidden>
              <MetricGlyph name={row.icon} size={20} />
            </span>
            <div className="metric-text">
              <div className="metric-label">{row.label}</div>
              <div className="metric-value">{row.value}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** История измерений вторички — Stitch bento + карточки ATM */
function SecondaryMeasures({ task }: { task: DemoTask }) {
  const { showToast } = useDemo()
  const [chartOpen, setChartOpen] = useState(false)
  const pon = task.ponMeasures ?? []
  const dslam = task.dslamMeasures ?? []
  const newestFirstPon = useMemo(() => [...pon].reverse(), [pon])
  const newestFirstDslam = useMemo(() => [...dslam].reverse(), [dslam])
  const latestPon = newestFirstPon[0]
  const latestDslam = newestFirstDslam[0]
  const hasBento = !!(latestPon || latestDslam)

  if (pon.length === 0 && dslam.length === 0) {
    return (
      <div className="detail-block">
        <p className="muted">История измерений недоступна</p>
      </div>
    )
  }

  return (
    <div className="detail-block stitch-secondary">
      {latestPon && (() => {
        const isLos = latestPon.onuRx != null && latestPon.onuRx <= -26
        return (
          <div className={`bento-grid${isLos ? ' is-los' : ''}`}>
            <div className="bento-tile">
              <div className="bento-tile-top">
                <MetricGlyph name="attenuation" size={20} />
                <span className={`bento-ok${isLos ? ' los' : ''}`}>{isLos ? 'LOS' : 'OK'}</span>
              </div>
              <p className="bento-label">Затухание</p>
              {/* При LOS нет связи со станцией — параметры ONU недоступны */}
              <p className={`bento-value${isLos ? ' na' : ''}`}>
                {isLos ? 'Нет связи' : formatAttenuationBento(latestPon.attenuation)}
              </p>
            </div>
            {latestPon.voltage && (
              <div className="bento-tile">
                <div className="bento-tile-top">
                  <MetricGlyph name="volt" size={20} />
                  <span className={`bento-ok${isLos ? ' los' : ''}`}>{isLos ? 'N/A' : 'Norm'}</span>
                </div>
                <p className="bento-label">Напряжение</p>
                <p className={`bento-value${isLos ? ' na' : ''}`}>
                  {isLos ? 'Нет связи' : latestPon.voltage}
                </p>
              </div>
            )}
            {latestPon.laserCurrent && (
              <div className="bento-tile">
                <div className="bento-tile-top">
                  <MetricGlyph name="laser" size={20} />
                  {isLos && <span className="bento-ok los">N/A</span>}
                </div>
                <p className="bento-label">Ток лазера</p>
                <p className={`bento-value${isLos ? ' na' : ''}`}>
                  {isLos ? 'Нет связи' : latestPon.laserCurrent}
                </p>
              </div>
            )}
            {latestPon.temperature && (
              <div className="bento-tile">
                <div className="bento-tile-top">
                  <MetricGlyph name="thermo" size={20} />
                  {isLos && <span className="bento-ok los">N/A</span>}
                </div>
                <p className="bento-label">Температура</p>
                <p className={`bento-value${isLos ? ' na' : ''}`}>
                  {isLos ? 'Нет связи' : latestPon.temperature}
                </p>
              </div>
            )}
          </div>
        )
      })()}

      {!latestPon && latestDslam && (
        <div className="bento-grid">
          <div className="bento-tile">
            <div className="bento-tile-top">
              <MetricGlyph name="signal" size={20} />
              <span className="bento-ok">OK</span>
            </div>
            <p className="bento-label">SNR</p>
            <p className="bento-value">{latestDslam.snr}</p>
          </div>
          <div className="bento-tile">
            <div className="bento-tile-top">
              <MetricGlyph name="attenuation" size={20} />
            </div>
            <p className="bento-label">Затухание</p>
            <p className="bento-value">{latestDslam.attenuation}</p>
          </div>
          <div className="bento-tile">
            <div className="bento-tile-top">
              <MetricGlyph name="speed" size={20} />
            </div>
            <p className="bento-label">Скорость</p>
            <p className="bento-value">{latestDslam.speed}</p>
          </div>
        </div>
      )}

      {hasBento && (
        <button
          type="button"
          className="btn btn-pill secondary-measure-btn"
          onClick={() => showToast('Измерения обновлены (демо)')}
        >
          Обновить
        </button>
      )}

      {pon.length > 1 && (
        <div className="signal-dynamics">
          <div className="section-head">
            <h3>Динамика сигнала</h3>
            <span className="muted">История</span>
          </div>
          <button
            type="button"
            className="btn btn-block btn-pill signal-chart-btn"
            onClick={() => setChartOpen(true)}
          >
            <IconChart size={18} />
            График
          </button>
        </div>
      )}

      {newestFirstPon.length > 0 && (
        <>
          <h4 className="carrier-section-title">История PON</h4>
          <ul className="measure-cards">
            {newestFirstPon.map((m) => (
              <li key={m.at} className="measure-card">
                <PonMeasureCard m={m} />
              </li>
            ))}
          </ul>
        </>
      )}

      {newestFirstDslam.length > 0 && (
        <>
          <h4 className="carrier-section-title">История DSLAM</h4>
          <ul className="measure-cards">
            {newestFirstDslam.map((m) => (
              <li key={m.at} className="measure-card">
                <DslamMeasureCard m={m} />
              </li>
            ))}
          </ul>
        </>
      )}

      <Modal open={chartOpen} onClose={() => setChartOpen(false)} title="График вторички" showClose={false}>
        <p className="muted" style={{ marginTop: 0 }}>
          ONU Rx
        </p>
        <OnuRxChart points={pon} />
        <div className="modal-actions">
          <button type="button" className="btn" onClick={() => setChartOpen(false)}>
            Закрыть
          </button>
        </div>
      </Modal>
    </div>
  )
}

function formatMeasureAt(at: string) {
  const m = at.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/)
  if (!m) return at
  return `${m[3]}.${m[2]}.${m[1]}, ${m[4]}:${m[5]}`
}

/** Затухание для плитки: «−15.10 / −16.20 дБ» */
function formatAttenuationBento(raw: string) {
  const { up, down } = parseUpDown(raw)
  if (up === '—' && down === '—') return raw
  const tidy = (v: string) => v.replace(/^-/, '−')
  return `${tidy(up)} / ${tidy(down)} дБ`
}

function parseUpDown(raw: string): { up: string; down: string } {
  const core = raw
    .replace(/\s*,?\s*dBa\s*$/i, '')
    .replace(/\s*дБм?\s*$/i, '')
    .trim()
  const [up = '—', down = '—'] = core.split('/').map((s) => s.trim())
  return { up: up || '—', down: down || '—' }
}

function MeasureHead({ at }: { at: string }) {
  return (
    <div className="measure-head">
      <span className="measure-head-ico">
        <MetricGlyph name="calendar" size={16} />
      </span>
      <div className="measure-head-text">
        <span className="measure-head-label">Измерено</span>
        <span className="measure-head-time">{formatMeasureAt(at)}</span>
      </div>
      <span className="measure-unit-badge">дБм</span>
    </div>
  )
}

function MeasurePairRow({
  icon,
  label,
  raw,
  unavailable,
}: {
  icon: MetricIcon
  label: string
  raw: string
  /** LOS / нет связи со станцией — значение не показывать */
  unavailable?: boolean
}) {
  const { up, down } = parseUpDown(raw)
  return (
    <div className="measure-pair">
      <span className="measure-pair-ico">
        <MetricGlyph name={icon} size={16} />
      </span>
      <span className="measure-pair-label">{label}</span>
      {unavailable ? (
        <span className="measure-pair-na">Нет связи</span>
      ) : (
        <div className="measure-pair-vals">
          <span className="measure-chip measure-chip-up">
            <span className="measure-chip-dir" aria-hidden>
              ↑
            </span>
            {up}
          </span>
          <span className="measure-chip measure-chip-down">
            <span className="measure-chip-dir" aria-hidden>
              ↓
            </span>
            {down}
          </span>
        </div>
      )}
    </div>
  )
}

/** Разбор «33.35 В» → число и единица */
function splitMeasureValue(raw: string) {
  const m = raw.trim().match(/^([+\-]?\d+(?:[.,]\d+)?)\s*(.*)$/)
  if (!m) return { num: raw, unit: '' }
  return { num: m[1].replace(',', '.'), unit: m[2].trim() }
}

function MeasureEnvTile({
  icon,
  label,
  value,
  tone,
  unavailable,
}: {
  icon: MetricIcon
  label: string
  value: string
  tone: 'volt' | 'amp' | 'temp'
  unavailable?: boolean
}) {
  const { num, unit } = unavailable ? { num: value, unit: '' } : splitMeasureValue(value)
  return (
    <div className={`measure-env measure-env-${tone}${unavailable ? ' na' : ''}`}>
      <span className="measure-env-ico" aria-hidden>
        <MetricGlyph name={icon} size={13} />
      </span>
      <span className="measure-env-text">
        <span className="measure-env-label">{label}</span>
        <span className="measure-env-value">
          <span className="measure-env-num">{num}</span>
          {unit && <span className="measure-env-unit">{unit}</span>}
        </span>
      </span>
    </div>
  )
}

function PonMeasureCard({ m }: { m: PonMeasure }) {
  const isLos = m.onuRx != null && m.onuRx <= -26
  return (
    <>
      <MeasureHead at={m.at} />
      <div className="measure-body">
        <MeasurePairRow icon="router" label="OLT" raw={m.oltUpDown} unavailable={isLos} />
        <MeasurePairRow icon="modem" label="ONU" raw={m.onuUpDown} unavailable={isLos} />
        <MeasurePairRow
          icon="attenuation"
          label="Затухание"
          raw={m.attenuation}
          unavailable={isLos}
        />
        {m.delta && (
          <MeasurePairRow icon="delta" label="Отклонение" raw={m.delta} unavailable={isLos} />
        )}
      </div>
      {(m.voltage || m.laserCurrent || m.temperature) && (
        <div className="measure-foot">
          {m.voltage && (
            <MeasureEnvTile
              icon="volt"
              label="Напряжение"
              value={isLos ? 'Нет связи' : m.voltage}
              tone="volt"
              unavailable={isLos}
            />
          )}
          {m.laserCurrent && (
            <MeasureEnvTile
              icon="laser"
              label="Ток лазера"
              value={isLos ? 'Нет связи' : m.laserCurrent}
              tone="amp"
              unavailable={isLos}
            />
          )}
          {m.temperature && (
            <MeasureEnvTile
              icon="thermo"
              label="Температура"
              value={isLos ? 'Нет связи' : m.temperature}
              tone="temp"
              unavailable={isLos}
            />
          )}
        </div>
      )}
    </>
  )
}

function DslamMeasureCard({ m }: { m: DslamMeasure }) {
  return (
    <>
      <div className="measure-head">
        <span className="measure-head-ico">
          <MetricGlyph name="calendar" size={16} />
        </span>
        <div className="measure-head-text">
          <span className="measure-head-label">Измерено</span>
          <span className="measure-head-time">{formatMeasureAt(m.at)}</span>
        </div>
        <span className="measure-unit-badge">↑/↓</span>
      </div>
      <div className="measure-body">
        <MeasurePairRow icon="speed" label="Скорость порта" raw={m.speed} />
        <MeasurePairRow icon="signal" label="Сигнал/шум" raw={m.snr} />
        <MeasurePairRow icon="attenuation" label="Затухание" raw={m.attenuation} />
        {m.attainableRate && (
          <MeasurePairRow icon="chart" label="Макс. скорость" raw={m.attainableRate} />
        )}
      </div>
    </>
  )
}

function OnuRxChart({ points }: { points: PonMeasure[] }) {
  const w = 320
  const h = 160
  const pad = 28
  if (points.length === 0) return <p className="muted">Нет точек</p>

  const ys = points.map((p) => p.onuRx)
  const minY = Math.min(...ys) - 1
  const maxY = Math.max(...ys) + 1
  const spanY = maxY - minY || 1

  const coords = points.map((p, i) => {
    const x = pad + (i / Math.max(points.length - 1, 1)) * (w - pad * 2)
    const y = pad + ((maxY - p.onuRx) / spanY) * (h - pad * 2)
    return { x, y, p }
  })
  const poly = coords.map((c) => `${c.x},${c.y}`).join(' ')

  return (
    <svg className="onu-chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="График ONU Rx">
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#c4b5d0" strokeWidth="1" />
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#c4b5d0" strokeWidth="1" />
      <text x={4} y={pad + 4} className="onu-chart-axis">
        {maxY.toFixed(1)}
      </text>
      <text x={4} y={h - pad} className="onu-chart-axis">
        {minY.toFixed(1)}
      </text>
      <polyline fill="none" stroke="#663479" strokeWidth="2.5" points={poly} />
      {coords.map((c) => (
        <circle key={c.p.at} cx={c.x} cy={c.y} r="3.5" fill="#33cee1" />
      ))}
      {coords.map((c, i) =>
        i === 0 || i === coords.length - 1 ? (
          <text key={`t-${c.p.at}`} x={c.x} y={h - 6} textAnchor="middle" className="onu-chart-axis">
            {c.p.at.slice(5, 10)}
          </text>
        ) : null,
      )}
    </svg>
  )
}
