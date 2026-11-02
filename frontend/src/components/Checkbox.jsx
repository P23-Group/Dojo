import { useRef } from 'react'
import { CheckIcon } from './icons.jsx'
import './checkbox.css'

export default function Checkbox({
  id,
  checked,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  ...props
}) {
  const inputRef = useRef(null)
  const labelId = `${id}-label`
  const errorId = `${id}-error`
  const hasError = typeof error === 'string'

  const classes = [
    'checkbox-field',
    hasError ? 'checkbox-field--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const handleRowClick = (event) => {
    if (event.target === inputRef.current) return
    if (event.target.closest('a, button')) return
    inputRef.current?.click()
  }

  return (
    <div className={classes}>
      <div className="checkbox-row" onClick={handleRowClick}>
        <input
          ref={inputRef}
          id={id}
          className="checkbox__input"
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-labelledby={labelId}
          aria-describedby={hasError ? errorId : undefined}
          aria-invalid={hasError}
          onChange={onChange}
          {...props}
        />
        <span className="checkbox__box" aria-hidden="true">
          <CheckIcon />
        </span>
        <span className="checkbox__label" id={labelId}>
          {label}
        </span>
      </div>

      {hasError && (
        <p className="checkbox__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
