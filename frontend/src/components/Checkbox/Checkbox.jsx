import { useId } from 'react';
import { CheckIcon } from '../icons';
import './Checkbox.css';

export default function Checkbox({ label, error, className = '', id, ...rest }) {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;

  return (
    <div className={`checkbox ${className}`}>
      <div className="checkbox__row">
        <input
          id={inputId}
          type="checkbox"
          className="checkbox__input"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        <label htmlFor={inputId} className="checkbox__label">
          <span className="checkbox__box">
            <CheckIcon size={14} />
          </span>
          <span>{label}</span>
        </label>
      </div>

      {error && (
        <p id={errorId} className="checkbox__error">
          {error}
        </p>
      )}
    </div>
  );
}
