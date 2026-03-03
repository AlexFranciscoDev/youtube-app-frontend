import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import './AuthForm.css'

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const passwordType = showPassword ? 'text' : 'password'
  const passwordLabel = showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
  const passwordIcon = showPassword ? faEyeSlash : faEye
  const confirmType = showConfirmPassword ? 'text' : 'password'
  const confirmLabel = showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
  const confirmIcon = showConfirmPassword ? faEyeSlash : faEye

  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="auth-icon">
          <FontAwesomeIcon icon={faPlay} />
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-description">Start organizing your favorite videos</p>
        <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
          <div className="auth-field">
            <label htmlFor="register-username">Username</label>
            <input
              id="register-username"
              className="auth-input"
              type="text"
              placeholder="@tu_usuario"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              className="auth-input"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <div className="password-wrapper">
              <input
                id="register-password"
                className="auth-input"
                type={passwordType}
                placeholder="*******"
                required
              />
              <button
                type="button"
                aria-label={passwordLabel}
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <FontAwesomeIcon icon={passwordIcon} />
              </button>
            </div>
          </div>
          <div className="auth-field">
            <label htmlFor="confirm-password">Confirm password</label>
            <div className="password-wrapper">
              <input
                id="confirm-password"
                className="auth-input"
                type={confirmType}
                placeholder="*******"
                required
              />
              <button
                type="button"
                aria-label={confirmLabel}
                className="password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <FontAwesomeIcon icon={confirmIcon} />
              </button>
            </div>
          </div>
          <button type="submit" className="auth-submit">
            Create account
          </button>
        </form>
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </section>
    </div>
  )
}
