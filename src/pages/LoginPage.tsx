import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader } from '../components/UiKit'
import { useDemo } from '../context/DemoContext'
import logoUrl from '../assets/logo.svg'

export function LoginPage() {
  const { loggedIn, login } = useDemo()
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
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
      <div className="login-screen">
        <div className="login-brand">
          <img className="brand-logo" src={logoUrl} alt="Белтелеком" width={240} height={30} />
          <h1>ATM БТК</h1>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="login">Логин</label>
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
          <div className="field">
            <label htmlFor="pass">Пароль</label>
            <input
              id="pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-block">
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}
