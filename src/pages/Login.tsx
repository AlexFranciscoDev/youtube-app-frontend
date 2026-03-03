import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './AuthForm.css';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordType = showPassword ? 'text' : 'password';
  const passwordLabel = showPassword ? 'Hide password' : 'Show password';
  const passwordIcon = showPassword ? faEyeSlash : faEye;

  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="auth-icon">
          <FontAwesomeIcon icon={faPlay} />
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-description">
          Sign in to your Video Organizer account
        </p>
        <form
          className="auth-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="auth-field">
            <label htmlFor="email">Email</label>
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
              <label htmlFor="password">Password</label>
              <a href="#" className="auth-link">
                Forgot your password?
              </a>
            </div>
            <div className="password-wrapper">
              <input
                id="password"
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
          <button type="submit" className="auth-submit">
            Sign in
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Sign up
          </Link>
        </p>
      </section>
    </div>
  );
};
