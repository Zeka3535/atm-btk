import type { AbonTraffic } from '../types'
import { IconChart } from './icons'
import { Modal } from './UiKit'

interface Props {
  traffic: AbonTraffic | null
  onClose: () => void
}

function fmtGb(n: number) {
  if (n === 0) return '0 ГБ'
  return `${n.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} ГБ`
}

function fmtHours(n: number) {
  if (n <= 0) return '0 ч'
  return `${n.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} ч`
}

function fmtDuration(n: number) {
  if (n <= 0) return '0 мин'
  const monthMinutes = 30 * 24 * 60
  const dayMinutes = 24 * 60
  const months = Math.floor(n / monthMinutes)
  const days = Math.floor((n % monthMinutes) / dayMinutes)
  const hours = Math.floor(n / 60)
  const mins = n % 60
  if (months > 0) return days > 0 ? `${months} мес ${days} д` : `${months} мес`
  if (hours >= 24) return `${Math.floor(n / dayMinutes)} д`
  if (hours === 0) return `${mins} мин`
  if (mins === 0) return `${hours} ч`
  return `${hours} ч ${mins} мин`
}

/** Статистика трафика абонента (демо) */
export function TrafficStatsModal({ traffic, onClose }: Props) {
  if (!traffic) return null

  const days = traffic.days ?? []
  const months = traffic.months ?? []
  const sessions = traffic.sessions
  const maxDay = Math.max(1, ...days.map((d) => d.down + d.up))

  return (
    <Modal open onClose={onClose} title="Статистика трафика" showClose={false}>
      <div className="traffic-modal">
        <div className="traffic-period">
          <IconChart size={18} />
          <span>{traffic.periodLabel}</span>
        </div>

        <div className="traffic-totals">
          <div className="traffic-total down">
            <span className="traffic-total-label">За месяц скачано</span>
            <strong>{fmtGb(traffic.downloadGb)}</strong>
          </div>
          <div className="traffic-total up">
            <span className="traffic-total-label">За месяц отдано</span>
            <strong>{fmtGb(traffic.uploadGb)}</strong>
          </div>
        </div>

        {sessions && (
          <>
            <h4 className="traffic-section-title">Продолжительность сессий</h4>
            <div className="traffic-session-grid">
              <div className="traffic-total">
                <span className="traffic-total-label">Общее время</span>
                <strong>{fmtHours(sessions.totalHours)}</strong>
              </div>
              <div className="traffic-total">
                <span className="traffic-total-label">Средняя сессия</span>
                <strong>{fmtDuration(sessions.averageMinutes)}</strong>
              </div>
              <div className="traffic-total">
                <span className="traffic-total-label">Максимум</span>
                <strong>{fmtDuration(sessions.longestMinutes)}</strong>
              </div>
              <div className="traffic-total">
                <span className="traffic-total-label">Сессий</span>
                <strong>{sessions.sessionsCount}</strong>
              </div>
            </div>
          </>
        )}

        {days.length > 0 && (
          <>
            <h4 className="traffic-section-title">Трафик по дням</h4>
            <div className="traffic-bars" aria-hidden>
              {days.map((d) => (
                <div key={d.label} className="traffic-bar-col">
                  <div className="traffic-bar-track">
                    <div
                      className="traffic-bar-fill"
                      style={{ height: `${Math.round(((d.down + d.up) / maxDay) * 100)}%` }}
                    />
                  </div>
                  <span className="traffic-bar-label">{d.label}</span>
                </div>
              ))}
            </div>
            <div className="traffic-breakdown-list">
              {days.map((d) => (
                <div key={`day-${d.label}`} className="traffic-breakdown-row">
                  <strong>{d.label}</strong>
                  <span>↓ {fmtGb(d.down)}</span>
                  <span>↑ {fmtGb(d.up)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {months.length > 0 && (
          <>
            <h4 className="traffic-section-title">Трафик по месяцам</h4>
            <div className="traffic-breakdown-list">
              {months.map((m) => (
                <div key={`month-${m.label}`} className="traffic-breakdown-row">
                  <strong>{m.label}</strong>
                  <span>↓ {fmtGb(m.down)}</span>
                  <span>↑ {fmtGb(m.up)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <button type="button" className="btn btn-ghost btn-block" onClick={onClose}>
        Закрыть
      </button>
    </Modal>
  )
}
