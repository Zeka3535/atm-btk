import { IconCloudOff, IconNotify } from '../components/icons'
import { BackToolbar } from '../components/NavChrome'
import { useDemo } from '../context/DemoContext'

function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      className={`toggle${checked ? ' on' : ''}${disabled ? ' disabled' : ''}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-knob" />
    </button>
  )
}

export function SettingsPage() {
  const {
    accountName,
    offline,
    setOffline,
    notifyEnabled,
    setNotifyEnabled,
    notifySound,
    setNotifySound,
    notifyVibrate,
    setNotifyVibrate,
    logout,
    demoNotifyNewTask,
  } = useDemo()

  return (
    <div className="page settings-page">
      <BackToolbar title="Назад" />

      <section className="card settings-group">
        <h2 className="settings-group-title">Учётная запись</h2>
        <div className="settings-account">
          <div className="settings-account-name">{accountName}</div>
        </div>
        <button type="button" className="btn-logout btn-logout-block" onClick={logout}>
          Выйти
        </button>
      </section>

      <section className="card settings-group">
        <h2 className="settings-group-title">
          <IconNotify size={16} />
          Уведомления
        </h2>
        <div className="switch-row">
          <div>
            <strong>Уведомления о новых заявках</strong>
            <div className="muted">In-app и системные (если разрешено)</div>
          </div>
          <Toggle
            label="Уведомления о новых заявках"
            checked={notifyEnabled}
            onChange={setNotifyEnabled}
          />
        </div>
        {notifyEnabled && (
          <>
            <div className="switch-row">
              <strong>Звук уведомлений</strong>
              <Toggle
                label="Звук уведомлений"
                checked={notifySound}
                onChange={setNotifySound}
              />
            </div>
            <div className="switch-row">
              <strong>Вибрация уведомлений</strong>
              <Toggle
                label="Вибрация уведомлений"
                checked={notifyVibrate}
                onChange={setNotifyVibrate}
              />
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-block settings-test-btn"
              onClick={() => void demoNotifyNewTask()}
            >
              Проверить уведомление
            </button>
          </>
        )}
      </section>

      <section className="card settings-group">
        <h2 className="settings-group-title">
          <IconCloudOff size={16} />
          Демо-режим
        </h2>
        <div className="switch-row">
          <div>
            <strong>Офлайн режим</strong>
            <div className="muted">
              Офлайн-баннер и кэш списка. Данные синхронизируются позже.
            </div>
          </div>
          <Toggle label="Офлайн режим" checked={offline} onChange={setOffline} />
        </div>
      </section>
    </div>
  )
}
