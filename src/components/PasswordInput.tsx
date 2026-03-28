import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

interface PasswordInputProps {
  id: string
  hasError: boolean
  placeholder?: string
  ariaLabel: string
  onChange: (value: string) => void
  onBlur: (value: string) => void
}

export const PasswordInput = ({
  id,
  hasError,
  placeholder = '*******',
  ariaLabel,
  onChange,
  onBlur,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="password-wrapper">
      <input
        id={id}
        className={`auth-input${hasError ? ' auth-input--error' : ''}`}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
      />
      <button
        type="button"
        aria-label={ariaLabel}
        className="password-toggle"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </button>
    </div>
  )
}
