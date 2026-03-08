import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import './AuthForm.css'
import { validateEmail, validatePassword } from '../utils/validators'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router'
import { Global } from '../helpers/Global'
import { PasswordInput } from '../components/PasswordInput'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })
  const [isLoading, setIsLoading] = useState(false)
  const [errorUser, setErrorUser] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    setErrorEmail(emailError)
    setErrorPassword(passwordError)
    setTouched({ email: true, password: true })
    if (emailError || passwordError) return

    setIsLoading(true)
    try {
      const response = await fetch(Global.url + 'user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (data.status === 'Error') {
        setErrorUser(data.message)
        return
      }
      setErrorUser('')
      login(data.user, data.token)
      navigate('/')
    } catch (error: unknown) {
      setErrorUser(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = !errorEmail && !errorPassword

  return (
    <div className="auth-page">
      <section className="auth-card">
        {isLoading && (
          <div className="auth-overlay" aria-live="polite">
            <div className="auth-spinner" role="status" aria-label="Loading">
              <span className="auth-spinner__dot" />
            </div>
          </div>
        )}
        <div className="auth-icon">
          <FontAwesomeIcon icon={faPlay} />
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-description">Sign in to your Video Organizer account</p>
        {errorUser && <span className="auth-error">{errorUser}</span>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className={`auth-input${errorEmail ? ' auth-input--error' : ''}`}
              type="email"
              placeholder="tu@email.com"
              onChange={(e) => {
                setEmail(e.target.value)
                if (touched.email) setErrorEmail(validateEmail(e.target.value))
              }}
              onBlur={(e) => {
                setTouched((prev) => ({ ...prev, email: true }))
                setErrorEmail(validateEmail(e.target.value))
              }}
            />
            {errorEmail && <span className="auth-error">{errorEmail}</span>}
          </div>
          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="password">Password</label>
              <a href="#" className="auth-link">Forgot your password?</a>
            </div>
            <PasswordInput
              id="password"
              hasError={!!errorPassword}
              ariaLabel={errorPassword ? 'Hide password' : 'Show password'}
              onChange={(value) => {
                setPassword(value)
                if (touched.password) setErrorPassword(validatePassword(value))
              }}
              onBlur={(value) => {
                setTouched((prev) => ({ ...prev, password: true }))
                setErrorPassword(validatePassword(value))
              }}
            />
            {errorPassword && <span className="auth-error">{errorPassword}</span>}
          </div>
          <button type="submit" className="auth-submit" disabled={!isFormValid || isLoading}>
            Sign in
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Sign up</Link>
        </p>
      </section>
    </div>
  )
}
