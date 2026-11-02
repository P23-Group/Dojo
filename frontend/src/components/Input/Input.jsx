import { forwardRef, useId } from 'react';
import './Input.css';

  // <Input label="Email" placeholder="Enter your email" />
  // <Input value={email} onChange={e => setEmail(e.target.value)} />
  // <Input error="Please enter a valid email" />

const Input = forwardRef(function Input(
  { label, error, className = '', id, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;

  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className={`field__control ${error ? 'field__control--error' : ''}`}>
        <input
          ref={ref}
          id={inputId}
          className="field__input"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
      </div>

      {error && (
        <p id={errorId} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
