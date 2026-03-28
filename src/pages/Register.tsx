import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import './AuthForm.css'
import { validateEmail, validatePassword, validateUsername, validateConfirmPassword, validateProfileImage } from '../utils/validators'
import { Global } from '../helpers/Global'
import { useNavigate } from 'react-router'
import { PasswordInput } from '../components/PasswordInput'

export const Register = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  const [errorUsername, setErrorUsername] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('')
  const [errorProfileImage, setErrorProfileImage] = useState('')
  const [submitMessage, setSubmitMessage] = useState<{ text: string; isError: boolean } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    profileImage: false,
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const usernameError = validateUsername(username)
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password)
    const profileImageError = validateProfileImage(profileImage)

    setErrorUsername(usernameError)
    setErrorEmail(emailError)
    setErrorPassword(passwordError)
    setErrorConfirmPassword(confirmPasswordError)
    setErrorProfileImage(profileImageError)
    setTouched({ username: true, email: true, password: true, confirmPassword: true, profileImage: true })

    if (usernameError || emailError || passwordError || confirmPasswordError || profileImageError) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('email', email)
      formData.append('password', password)
      if (profileImage) formData.append('image', profileImage)

      const response = await fetch(Global.url + 'user/register', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (data.status === 'Error') {
        setSubmitMessage({ text: data.message, isError: true })
        return
      }

      setSubmitMessage({ text: data.message, isError: false })
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = !errorUsername && !errorEmail && !errorPassword && !errorConfirmPassword && !errorProfileImage

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
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-description">Start organizing your favorite videos</p>
        {submitMessage && (
          <span className={submitMessage.isError ? 'auth-error' : 'auth-success'}>
            {submitMessage.text}
          </span>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="register-username">Username</label>
            <input
              id="register-username"
              className={`auth-input${errorUsername ? ' auth-input--error' : ''}`}
              type="text"
              placeholder="@tu_usuario"
              onChange={(e) => {
                setUsername(e.target.value)
                if (touched.username) setErrorUsername(validateUsername(e.target.value))
              }}
              onBlur={(e) => {
                setTouched((prev) => ({ ...prev, username: true }))
                setErrorUsername(validateUsername(e.target.value))
              }}
            />
            {errorUsername && <span className="auth-error">{errorUsername}</span>}
          </div>
          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
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
            <label htmlFor="register-password">Password</label>
            <PasswordInput
              id="register-password"
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
          <div className="auth-field">
            <label htmlFor="confirm-password">Confirm password</label>
            <PasswordInput
              id="confirm-password"
              hasError={!!errorConfirmPassword}
              ariaLabel={errorConfirmPassword ? 'Hide password' : 'Show password'}
              onChange={(value) => {
                setConfirmPassword(value)
                if (touched.confirmPassword) setErrorConfirmPassword(validateConfirmPassword(value, password))
              }}
              onBlur={(value) => {
                setTouched((prev) => ({ ...prev, confirmPassword: true }))
                setErrorConfirmPassword(validateConfirmPassword(value, password))
              }}
            />
            {errorConfirmPassword && <span className="auth-error">{errorConfirmPassword}</span>}
          </div>
          <div className="auth-field">
            <label htmlFor="register-profileimage">Profile image</label>
            <input
              id="register-profileimage"
              className={`auth-input${errorProfileImage ? ' auth-input--error' : ''}`}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                setProfileImage(file)
                setPreviewSrc((prev) => {
                  if (prev) URL.revokeObjectURL(prev)
                  return file ? URL.createObjectURL(file) : null
                })
                if (touched.profileImage) setErrorProfileImage(validateProfileImage(file))
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, profileImage: true }))
                setErrorProfileImage(validateProfileImage(profileImage))
              }}
            />
            {errorProfileImage && <span className="auth-error">{errorProfileImage}</span>}
          </div>
          {previewSrc && (
            <div className="auth-field">
              <span>Preview:</span>
              <img src={previewSrc} alt="Profile preview" className="profile-preview" />
            </div>
          )}
          <button type="submit" className="auth-submit" disabled={!isFormValid || isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </section>
    </div>
  )
}
