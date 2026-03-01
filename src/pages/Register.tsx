import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faEye } from '@fortawesome/free-solid-svg-icons'
import './AuthForm.css'

export const Register = () => {
  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="auth-icon">
          <FontAwesomeIcon icon={faPlay} />
        </div>
        <h1 className="auth-title">Crea tu cuenta</h1>
        <p className="auth-description">Empieza a organizar tus videos favoritos</p>
        <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
          <div className="auth-field">
            <label htmlFor="register-username">Nombre de usuario</label>
            <input
              id="register-username"
              className="auth-input"
              type="text"
              placeholder="@tu_usuario"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="register-email">Correo electrónico</label>
            <input
              id="register-email"
              className="auth-input"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="register-password">Contraseña</label>
            <div className="password-wrapper">
              <input
                id="register-password"
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
          <div className="auth-field">
            <label htmlFor="confirm-password">Confirmar contraseña</label>
            <div className="password-wrapper">
              <input
                id="confirm-password"
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
            Crear cuenta
          </button>
        </form>
        <p className="auth-footer">
          Ya tienes cuenta?{' '}
          <Link to="/login" className="auth-link">
            Inicia sesión
          </Link>
        </p>
      </section>
    </div>
  )
}
