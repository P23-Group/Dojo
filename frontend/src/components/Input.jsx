import { useId, useState } from 'react'
import { EyeIcon, EyeOffIcon } from './icons.jsx'
import './input.css'

export default function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  hint,
  icon,
  disabled = false,
  autoComplete,
  name,
  togglePassword = false,
  className = '',
  ...props
}) {
  const generatedId = useId()
  const inputId = id || generatedId
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && togglePassword && showPassword ? 'text' : type
  const hasError = Boolean(error)

  const fieldClasses = [
    'field',
    hasError ? 'field--error' : '',
    disabled ? 'field--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={fieldClasses}>
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className="field__control">
        {icon && <span className="field__icon">{icon}</span>}

        <input
          id={inputId}
          className="field__input"
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : hint
                ? `${inputId}-hint`
                : undefined
          }
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        />

        {isPassword && togglePassword && (
          <button
            type="button"
            className="field__toggle"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((shown) => !shown)}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {hasError ? (
        <p className="field__message field__message--error" id={`${inputId}-error`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field__message field__message--hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
