import { useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { ContactsModal } from '../components/ContactsModal'
import { MapsModal } from '../components/MapsModal'
import { IconChart, MetricGlyph } from '../components/icons'
import { BackToolbar } from '../components/NavChrome'
import { ReportModal } from '../components/ReportModal'
import { TabsScroll } from '../components/TabsScroll'
import { TaskFooter } from '../components/TaskFooter'
import { WifiSettingsModal } from '../components/WifiSettingsModal'
import { LinkedText, Modal } from '../components/UiKit'
import { useDemo } from '../context/DemoContext'
import { isReportSentToday } from '../data/mockTasks'
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
import { cityTelHref, formatCityPhone, screensForCarrier } from '../types'

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
        <BackToolbar title="Назад" />
        <p>Заявка не найдена</p>
      </div>
    )
  }

  const done = task.isClosed || isReportSentToday(task)

  return (
    <div className="page detail-page">
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

      {/* Шапка заявки — как карточка в списке ATM */}
      <div className="card detail-head-card">
        <div className="task-header">
          <p className={`task-address${done ? ' done' : ''}`}>{task.address}</p>
          <div className="task-header-meta">
            <span className="task-date">{task.dateLabel}</span>
            <span className="badge badge-period">{task.periodLabel}</span>
          </div>
        </div>
        <div className="task-divider" />

        <p className={`fio${done ? ' done' : ''}`}>{task.subscriber}</p>
        {task.damage && <p className="damage">{task.damage}</p>}
        <p className="task-text">
          <LinkedText text={task.text} />
        </p>

        <TaskFooter
          task={task}
          onMaps={() => setMapAddr(task.address)}
          onContacts={setContacts}
          onReport={() => {
            if (task.isClosed) {
              showToast('Заявка закрыта. Отчёт нельзя отправить')
              return
            }
            setReportOpen(true)
          }}
        />
      </div>

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
    const hasWifi =
      !!task.wifi || task.services.includes('wifi') || list.some((s) => s.type.includes('Wi'))

    return (
      <div className="detail-block">
        {list.length === 0 && (!task.serviceLines || task.serviceLines.length === 0) && (
          <p className="muted">Услуги не привязаны к заявке</p>
        )}

        {list.length > 0 ? (
          <ul className="abon-service-list">
            {list.map((s) => (
              <AbonServiceRow key={`${s.type}-${s.tariff}`} service={s} />
            ))}
          </ul>
        ) : (
          <ul className="service-list">
            {(task.serviceLines ?? []).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}

        {hasWifi && (
          <button type="button" className="btn btn-ghost btn-block wifi-detail-btn" onClick={onWifi}>
            Настройка Wi‑Fi
          </button>
        )}
      </div>
    )
  }

  if (tab === 'history') {
    return (
      <div className="detail-block history-block">
        {task.history.length === 0 && <p className="muted">История пуста</p>}
        <ol className="history-timeline">
          {task.history.map((h, i) => {
            const hasReport = Boolean(h.closeNote && h.closeNote !== '—')
            return (
              <li key={i} className="history-item">
                <div className="history-rail" aria-hidden>
                  <span className="history-dot" />
                </div>
                <article className="history-card">
                  <header className="history-card-head">
                    <time className="history-date" dateTime={h.date}>
                      {formatHistoryDate(h.date)}
                    </time>
                    <span className="history-worker">{formatWorkerShort(h.worker)}</span>
                  </header>
                  <div className="history-section">
                    <span className="history-chip">Заявка</span>
                    <p className="history-note">
                      <LinkedText text={h.note} />
                    </p>
                  </div>
                  {hasReport && (
                    <div className="history-section history-section-report">
                      <span className="history-chip history-chip-report">Отчёт</span>
                      <p className="history-note">
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
    return <CarrierTabBlock title={title} modem={task.modem} rows={task.carrierMetrics} />
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

function AbonServiceRow({ service }: { service: AbonService }) {
  const st =
    service.status === 'online'
      ? null
      : service.status === 'offline'
        ? 'Нет связи'
        : service.status === 'blocked'
          ? 'Блок'
          : null

  return (
    <li className={`abon-service abon-${service.status ?? 'unknown'}`}>
      <span className={`abon-dot abon-dot-${service.status ?? 'unknown'}`} aria-hidden />
      <div className="abon-body">
        <div className="abon-type-row">
          <strong>{service.type}</strong>
          {service.login && <span className="abon-po">{service.login}</span>}
          {service.cityPhone && (
            <a className="abon-po" href={cityTelHref(service.cityPhone)}>
              {formatCityPhone(service.cityPhone)}
            </a>
          )}
        </div>
        <div className="abon-tariff">{service.tariff}</div>
        {st && <div className="abon-status">{st}</div>}
      </div>
    </li>
  )
}

function isModemOnline(status: string) {
  return status.trim().toLowerCase() === 'в сети'
}

/** Вкладка носителя: модем/порты и параметры в одной карточке */
function CarrierTabBlock({
  title,
  modem,
  rows,
}: {
  title: string
  modem?: ModemPanel
  rows?: MetricRow[]
}) {
  const { showToast } = useDemo()
  const [ports, setPorts] = useState<ModemPort[]>(modem?.ports ?? [])
  const [modemOn, setModemOn] = useState(() => (modem ? isModemOnline(modem.modemStatus) : false))

  useEffect(() => {
    setPorts(modem?.ports ?? [])
    setModemOn(modem ? isModemOnline(modem.modemStatus) : false)
  }, [modem])

  const modemLabel = modem
    ? modemOn
      ? 'в сети'
      : modem.modemStatus === 'в сети'
        ? 'не в сети'
        : modem.modemStatus
    : ''

  const togglePort = (name: string) => {
    setPorts((prev) =>
      prev.map((p) => (p.name === name ? { ...p, enabled: !p.enabled } : p)),
    )
  }

  const hasMetrics = rows && rows.length > 0

  return (
    <div className="detail-block carrier-tab">
      <h3>{title}</h3>

      {modem && (
        <div className="modem-panel">
          <div className="modem-card">
            {modem.portStatus && (
              <div className="modem-status-row">
                <span className="modem-status-label">порт</span>
                <strong className="modem-status-value">{modem.portStatus}</strong>
              </div>
            )}
            <div className="modem-status-row">
              <span className="modem-status-label">Модем:</span>
              <strong className={`modem-status-value${modemOn ? ' on' : ' off'}`}>{modemLabel}</strong>
              <button
                type="button"
                className={`toggle${modemOn ? ' on' : ''}`}
                aria-label={modemOn ? 'Модем в сети' : 'Модем не в сети'}
                onClick={() => setModemOn((v) => !v)}
              >
                <span className="toggle-knob" />
              </button>
            </div>
          </div>

          {(modem.profile || modem.speed) && (
            <div className="modem-card modem-profile-card">
              <div className="modem-profile-text">
                {modem.speed && (
                  <div className="modem-status-row">
                    <span className="modem-status-label">Скор:</span>
                    <strong className="modem-status-value">{modem.speed}</strong>
                  </div>
                )}
                {modem.profile && (
                  <div className="modem-status-row">
                    <span className="modem-status-label">Проф:</span>
                    <strong className="modem-status-value">{modem.profile}</strong>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => showToast('Профиль', 'Проверка профиля (демо)')}
              >
                профиль
              </button>
            </div>
          )}

          {ports.length > 0 && (
            <>
              <h4 className="carrier-section-title">Порты</h4>
              <ul className="modem-port-list">
                {ports.map((port, idx) => (
                  <li key={port.name} className="modem-port-row">
                    <div className="modem-port-main">
                      {port.login != null && (
                        <span className="modem-port-num" aria-hidden>
                          {idx + 1}
                        </span>
                      )}
                      <div className="modem-port-text">
                        <strong>{port.name}</strong>
                        {port.login && <span className="modem-port-login">{port.login}</span>}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`toggle${port.enabled ? ' on' : ''}`}
                      aria-label={`${port.name}: ${port.enabled ? 'вкл' : 'выкл'}`}
                      onClick={() => togglePort(port.name)}
                    >
                      <span className="toggle-knob" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {hasMetrics ? (
        <>
          {modem && <h4 className="carrier-section-title">Параметры</h4>}
          <ul className="metric-list">
            {rows!.map((row) => (
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
        </>
      ) : (
        !modem && <p className="muted">Параметры носителя недоступны (демо)</p>
      )}
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

/** История измерений вторички — карточки как в ATM */
function SecondaryMeasures({ task }: { task: DemoTask }) {
  const [chartOpen, setChartOpen] = useState(false)
  const pon = task.ponMeasures ?? []
  const dslam = task.dslamMeasures ?? []
  const newestFirstPon = useMemo(() => [...pon].reverse(), [pon])
  const newestFirstDslam = useMemo(() => [...dslam].reverse(), [dslam])

  if (pon.length === 0 && dslam.length === 0) {
    return (
      <div className="detail-block">
        <p className="muted">История измерений недоступна</p>
      </div>
    )
  }

  return (
    <div className="detail-block">
      {pon.length > 1 && (
        <button type="button" className="chart-bar" onClick={() => setChartOpen(true)}>
          <span className="chart-bar-icon">
            <IconChart size={22} />
          </span>
          <span className="chart-bar-title">График измерений</span>
          <span className="chart-bar-btn" aria-hidden>
            <IconChart size={18} />
          </span>
        </button>
      )}

      {newestFirstPon.length > 0 && (
        <ul className="measure-cards">
          {newestFirstPon.map((m) => (
            <li key={m.at} className="measure-card">
              <PonMeasureCard m={m} />
            </li>
          ))}
        </ul>
      )}

      {newestFirstDslam.length > 0 && (
        <ul className="measure-cards">
          {newestFirstDslam.map((m) => (
            <li key={m.at} className="measure-card">
              <DslamMeasureCard m={m} />
            </li>
          ))}
        </ul>
      )}

      <Modal open={chartOpen} onClose={() => setChartOpen(false)} title="График вторички">
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
}: {
  icon: MetricIcon
  label: string
  raw: string
}) {
  const { up, down } = parseUpDown(raw)
  return (
    <div className="measure-pair">
      <span className="measure-pair-ico">
        <MetricGlyph name={icon} size={16} />
      </span>
      <span className="measure-pair-label">{label}</span>
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
}: {
  icon: MetricIcon
  label: string
  value: string
  tone: 'volt' | 'amp' | 'temp'
}) {
  const { num, unit } = splitMeasureValue(value)
  return (
    <div className={`measure-env measure-env-${tone}`}>
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
  return (
    <>
      <MeasureHead at={m.at} />
      <div className="measure-body">
        <MeasurePairRow icon="router" label="OLT" raw={m.oltUpDown} />
        <MeasurePairRow icon="modem" label="ONU" raw={m.onuUpDown} />
        <MeasurePairRow icon="attenuation" label="Затухание" raw={m.attenuation} />
        {m.delta && <MeasurePairRow icon="delta" label="Отклонение" raw={m.delta} />}
      </div>
      {(m.voltage || m.laserCurrent || m.temperature) && (
        <div className="measure-foot">
          {m.voltage && (
            <MeasureEnvTile icon="volt" label="Напряжение" value={m.voltage} tone="volt" />
          )}
          {m.laserCurrent && (
            <MeasureEnvTile icon="laser" label="Ток лазера" value={m.laserCurrent} tone="amp" />
          )}
          {m.temperature && (
            <MeasureEnvTile icon="thermo" label="Температура" value={m.temperature} tone="temp" />
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
