import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faEye } from '@fortawesome/free-solid-svg-icons'
import './AuthForm.css'

export const Login = () => {
  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="auth-icon">
          <FontAwesomeIcon icon={faPlay} />
        </div>
        <h1 className="auth-title">Bienvenido de nuevo</h1>
        <p className="auth-description">
          Inicia sesión en tu cuenta de Video Organizer
        </p>
        <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
          <div className="auth-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="password">Contraseña</label>
              <a href="#" className="auth-link">
                Olvidaste tu contraseña?
              </a>
            </div>
            <div className="password-wrapper">
              <input
                id="password"
                className="auth-input"
                type="password"
                placeholder="*******"
                required
              />
              <button
                type="button"
                aria-label="Mostrar contraseña"
                className="password-toggle"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
            </div>
          </div>
          <button type="submit" className="auth-submit">
            Iniciar sesión
          </button>
        </form>
        <p className="auth-footer">
          No tienes cuenta?{' '}
          <Link to="/register" className="auth-link">
            Regístrate
          </Link>
        </p>
      </section>
    </div>
  )
}
