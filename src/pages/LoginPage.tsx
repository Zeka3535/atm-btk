import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { IconEye, IconEyeOff, IconLock, IconUser } from '../components/icons'
import { Loader } from '../components/UiKit'
import { useDemo } from '../context/DemoContext'
import logoUrl from '../assets/logo.svg'

export function LoginPage() {
  const { loggedIn, login } = useDemo()
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (loggedIn) return <Navigate to="/tasks" replace />

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Введите логин')
      return
    }
    setError('')
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      login(name)
    }, 450)
  }

  return (
    <div className="app-shell login-shell">
      {loading && <Loader />}
      <header className="login-hero">
        <img
          className="login-hero-logo"
          src={logoUrl}
          alt="Белтелеком"
          width={260}
          height={97}
        />
      </header>

      <div className="login-screen">
        <form className="login-form" onSubmit={onSubmit}>
          <div className="login-form-head">
            <h2>Авторизация</h2>
            <p>Введите учётные данные для доступа к заявкам</p>
          </div>

          <div className="field">
            <label htmlFor="login">Логин</label>
            <div className="field-control">
              <span className="field-ico" aria-hidden>
                <IconUser size={20} />
              </span>
              <input
                id="login"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Табельный / логин"
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="pass">Пароль</label>
            <div className="field-control">
              <span className="field-ico" aria-hidden>
                <IconLock size={20} />
              </span>
              <input
                id="pass"
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="field-trail"
                aria-label={showPass ? 'Скрыть пароль' : 'Показать пароль'}
                onClick={() => setShowPass((v) => !v)}
              >
                {showPass ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
            </div>
          </div>

          <div className="login-row">
            <label className="login-check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Запомнить меня</span>
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-block btn-pill">
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}
